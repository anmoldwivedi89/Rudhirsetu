/**
 * AI Donor Prediction Engine — TensorFlow.js
 *
 * Runs entirely client-side. Model is trained once on mock data,
 * then cached in-memory for instant subsequent predictions (~1 ms).
 */
import * as tf from '@tensorflow/tfjs'
import { generateTrainingData, norm, bloodGroupOneHot } from './mockTrainingData'

// ── singleton cache ──────────────────────────────────────────────
let _model = null
let _training = null   // promise while training is in-flight

// ── Feature preparation ──────────────────────────────────────────
/**
 * Convert a Firestore user profile into a normalised feature array.
 * @param {Object} profile – from AuthContext / Firestore
 * @returns {number[]} 12 floats
 */
export function prepareDonorFeatures(profile = {}) {
  // Age from dob
  let age = 30 // fallback
  if (profile.dob) {
    const birth = new Date(profile.dob)
    if (!isNaN(birth)) {
      age = (Date.now() - birth.getTime()) / (365.25 * 24 * 3600 * 1000)
    }
  }

  // Weight
  const rawWeight = parseFloat(String(profile.weight).replace(/[^0-9.]/g, '')) || 65
  const weight = rawWeight

  // Days since last donation
  let daysSince = 120 // fallback if unknown
  if (profile.lastDonationDate) {
    const ld = new Date(profile.lastDonationDate)
    if (!isNaN(ld)) {
      daysSince = Math.max(0, (Date.now() - ld.getTime()) / (24 * 3600 * 1000))
    }
  }

  // Total donations
  const totalDonations = parseInt(profile.totalDonations, 10) || 0

  // Health booleans
  const med = profile.medical || {}
  const diabetes = med.diabetes ? 1 : 0
  const smoking = med.smoking ? 1 : 0
  const alcohol = med.alcohol ? 1 : 0

  // Blood group
  const bg = profile.bloodGroup || 'O+'

  return [
    norm(age, 18, 65),
    norm(weight, 40, 120),
    norm(daysSince, 0, 365),
    norm(totalDonations, 0, 50),
    diabetes,
    smoking,
    alcohol,
    ...bloodGroupOneHot(bg),
  ]
}

// ── Model architecture ───────────────────────────────────────────
function createModel() {
  const model = tf.sequential()
  model.add(tf.layers.dense({ inputShape: [12], units: 16, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }))
  // 2 outputs: [eligibility (sigmoid), score (sigmoid → 0-1)]
  model.add(tf.layers.dense({ units: 2, activation: 'sigmoid' }))

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError',
    metrics: ['accuracy'],
  })

  return model
}

// ── Training ─────────────────────────────────────────────────────
async function trainModel() {
  const model = createModel()
  const data = generateTrainingData(120)

  const xs = tf.tensor2d(data.map(d => d.features))
  const ys = tf.tensor2d(data.map(d => d.labels))

  await model.fit(xs, ys, {
    epochs: 50,
    batchSize: 16,
    shuffle: true,
    verbose: 0,
  })

  // Dispose training tensors
  xs.dispose()
  ys.dispose()

  return model
}

// ── Get / train model (singleton) ────────────────────────────────
async function getModel() {
  if (_model) return _model
  // Avoid double-training if called concurrently
  if (!_training) {
    _training = trainModel().then(m => {
      _model = m
      _training = null
      return m
    })
  }
  return _training
}

// ── Public prediction API ────────────────────────────────────────
/**
 * Predict donor eligibility and readiness.
 * @param {Object} profile – Firestore user profile
 * @returns {Promise<{ eligible: boolean, score: number, nextEligibleDays: number }>}
 */
export async function predictDonor(profile) {
  const model = await getModel()
  const features = prepareDonorFeatures(profile)
  const input = tf.tensor2d([features])
  const output = model.predict(input)
  const [eligibility, rawScore] = await output.data()

  input.dispose()
  output.dispose()

  const eligible = eligibility >= 0.5
  const score = Math.round(rawScore * 100)

  // Calculate next eligible days
  let nextEligibleDays = 0
  if (!eligible) {
    // Minimum gap between donations is 56 days
    let daysSince = 120
    if (profile.lastDonationDate) {
      const ld = new Date(profile.lastDonationDate)
      if (!isNaN(ld)) {
        daysSince = Math.max(0, (Date.now() - ld.getTime()) / (24 * 3600 * 1000))
      }
    }
    nextEligibleDays = Math.max(0, Math.ceil(56 - daysSince))
    if (nextEligibleDays === 0) nextEligibleDays = 14 // health-related cooldown
  }

  return { eligible, score, nextEligibleDays }
}

/**
 * Force re-training (e.g. after significant data change).
 * In a production app this would retrain on real data from Firestore.
 */
export async function resetModel() {
  if (_model) {
    _model.dispose()
    _model = null
  }
  _training = null
}
