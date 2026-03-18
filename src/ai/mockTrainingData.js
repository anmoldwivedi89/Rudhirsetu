/**
 * Mock training data for the donor prediction AI model.
 * Each sample has 12 features and 2 labels (eligibility, readiness score).
 *
 * Features (in order):
 *  0  age (normalised 18–65 → 0–1)
 *  1  weight (normalised 40–120 → 0–1)
 *  2  daysSinceLastDonation (normalised 0–365 → 0–1)
 *  3  totalDonations (normalised 0–50 → 0–1)
 *  4  diabetes (0 or 1)
 *  5  smoking (0 or 1)
 *  6  alcohol (0 or 1)
 *  7–11 blood group one-hot (A, B, AB, O, Rare)
 *
 * Labels:
 *  [0] eligibility  (0 or 1)
 *  [1] score         (0–1, maps to 0–100)
 */

function norm(val, min, max) {
  return Math.max(0, Math.min(1, (val - min) / (max - min)))
}

function bloodGroupOneHot(group) {
  const map = { A: 0, B: 1, AB: 2, O: 3 }
  const vec = [0, 0, 0, 0, 0]
  const idx = map[group.replace(/[+-]/, '').toUpperCase()]
  if (idx !== undefined) vec[idx] = 1
  else vec[4] = 1 // rare
  return vec
}

function generateSample(overrides = {}) {
  const age = overrides.age ?? 18 + Math.random() * 47
  const weight = overrides.weight ?? 45 + Math.random() * 70
  const daysSince = overrides.daysSince ?? Math.random() * 365
  const totalDonations = overrides.totalDonations ?? Math.floor(Math.random() * 30)
  const diabetes = overrides.diabetes ?? (Math.random() < 0.1 ? 1 : 0)
  const smoking = overrides.smoking ?? (Math.random() < 0.2 ? 1 : 0)
  const alcohol = overrides.alcohol ?? (Math.random() < 0.25 ? 1 : 0)
  const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  const bg = overrides.bg ?? groups[Math.floor(Math.random() * groups.length)]

  // --- Rules-based labelling (deterministic ground truth) ---
  const eligible =
    age >= 18 &&
    age <= 65 &&
    weight >= 50 &&
    daysSince >= 56 &&
    !diabetes &&
    !smoking

  // Score: higher = more ready
  let score = 0.5
  score += norm(daysSince, 56, 365) * 0.25        // longer gap → more ready
  score += norm(weight, 50, 100) * 0.1             // healthy weight bump
  score -= diabetes ? 0.3 : 0
  score -= smoking ? 0.2 : 0
  score -= alcohol ? 0.05 : 0
  score += norm(totalDonations, 0, 20) * 0.1       // experienced donors
  score -= daysSince < 56 ? 0.35 : 0               // too recent penalty
  score -= weight < 50 ? 0.25 : 0                  // underweight penalty
  score = Math.max(0, Math.min(1, score))

  const features = [
    norm(age, 18, 65),
    norm(weight, 40, 120),
    norm(daysSince, 0, 365),
    norm(totalDonations, 0, 50),
    diabetes,
    smoking,
    alcohol,
    ...bloodGroupOneHot(bg),
  ]

  return { features, labels: [eligible ? 1 : 0, score] }
}

export function generateTrainingData(count = 120) {
  const data = []

  // ---------- curated edge-case samples ----------
  // Healthy eligible donor
  data.push(generateSample({ age: 30, weight: 72, daysSince: 120, totalDonations: 5, diabetes: 0, smoking: 0, alcohol: 0, bg: 'B+' }))
  // Recent donation → not eligible
  data.push(generateSample({ age: 25, weight: 68, daysSince: 10, totalDonations: 3, diabetes: 0, smoking: 0, alcohol: 0, bg: 'O+' }))
  // Underweight
  data.push(generateSample({ age: 22, weight: 42, daysSince: 100, totalDonations: 1, diabetes: 0, smoking: 0, alcohol: 0, bg: 'A-' }))
  // Diabetic
  data.push(generateSample({ age: 45, weight: 80, daysSince: 200, totalDonations: 10, diabetes: 1, smoking: 0, alcohol: 0, bg: 'AB+' }))
  // Smoker
  data.push(generateSample({ age: 35, weight: 75, daysSince: 90, totalDonations: 8, diabetes: 0, smoking: 1, alcohol: 0, bg: 'B-' }))
  // Too young (edge)
  data.push(generateSample({ age: 17, weight: 55, daysSince: 0, totalDonations: 0, diabetes: 0, smoking: 0, alcohol: 0, bg: 'O-' }))
  // Perfect veteran donor
  data.push(generateSample({ age: 40, weight: 78, daysSince: 300, totalDonations: 25, diabetes: 0, smoking: 0, alcohol: 0, bg: 'O+' }))
  // Multiple risk factors
  data.push(generateSample({ age: 55, weight: 44, daysSince: 30, totalDonations: 0, diabetes: 1, smoking: 1, alcohol: 1, bg: 'A+' }))

  // ---------- random samples ----------
  while (data.length < count) {
    data.push(generateSample())
  }

  return data
}

export { norm, bloodGroupOneHot }
