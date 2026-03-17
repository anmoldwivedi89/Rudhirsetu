import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Phone, MessageCircle, Filter, SlidersHorizontal } from 'lucide-react'
import Navbar from '../components/Navbar'
import { PageEnter, BloodBadge, UrgencyTag, GlassCard } from '../components/UI'
import EmergencyModal from '../components/EmergencyModal'

const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const results = [
  { id: 1, name: 'Apollo Hospital Mumbai', blood: 'O-', dist: '0.8 km', urgency: 'critical', time: '2 min ago', units: 3, contact: '+91 98765 43210' },
  { id: 2, name: 'Rahul M. (Donor)', blood: 'B+', dist: '1.4 km', urgency: 'high', time: '8 min ago', units: 1, contact: '+91 87654 32109' },
  { id: 3, name: 'AIIMS Delhi', blood: 'AB+', dist: '2.1 km', urgency: 'medium', time: '15 min ago', units: 2, contact: '+91 11234 56789' },
  { id: 4, name: 'Priya S. (Donor)', blood: 'A+', dist: '3.0 km', urgency: 'low', time: '1 hr ago', units: 1, contact: '+91 76543 21098' },
  { id: 5, name: 'City Hospital', blood: 'O+', dist: '3.8 km', urgency: 'high', time: '2 hr ago', units: 4, contact: '+91 22345 67890' },
  { id: 6, name: 'Ankit K. (Donor)', blood: 'A-', dist: '4.2 km', urgency: 'medium', time: '3 hr ago', units: 1, contact: '+91 65432 10987' },
]

// Simple map simulation
function MapSimulation({ results }) {
  const pins = [
    { x: 35, y: 45, type: 'hospital', label: 'Apollo' },
    { x: 55, y: 30, type: 'donor', label: 'Rahul M.' },
    { x: 70, y: 60, type: 'hospital', label: 'AIIMS' },
    { x: 25, y: 65, type: 'donor', label: 'Priya S.' },
    { x: 80, y: 35, type: 'donor', label: 'Ankit K.' },
    { x: 50, y: 75, type: 'hospital', label: 'City Hospital' },
    { x: 45, y: 50, type: 'you', label: 'You' },
  ]
  const [hoveredPin, setHoveredPin] = useState(null)

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#0f1218]">
      {/* Map grid */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'linear-gradient(rgba(239,68,68,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.8) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      {/* Glow at center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-blood-500/10 blur-[50px]" />

      {/* Road lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        <line x1="0" y1="25" x2="100" y2="75" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
        <line x1="20" y1="0" x2="80" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.2" />
      </svg>

      {/* Pins */}
      {pins.map((pin, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => setHoveredPin(i)}
          onMouseLeave={() => setHoveredPin(null)}
        >
          {pin.type === 'you' ? (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500/50 cursor-pointer"
            />
          ) : (
            <motion.div
              whileHover={{ scale: 1.3 }}
              className={`w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-xs font-bold ${
                pin.type === 'hospital' ? 'bg-blood-500 shadow-blood-500/50' : 'bg-green-500 shadow-green-500/50'
              }`}
            >
              {pin.type === 'hospital' ? '🏥' : '🩸'}
            </motion.div>
          )}

          <AnimatePresence>
            {hoveredPin === i && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: -5, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 glass rounded-xl px-3 py-2 whitespace-nowrap text-xs text-white border border-white/10 z-10"
              >
                {pin.label}
              </motion.div>
            )}
          </AnimatePresence>

          {pin.type !== 'you' && (
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute inset-0 rounded-full ${pin.type === 'hospital' ? 'bg-blood-500/30' : 'bg-green-500/30'}`}
            />
          )}
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
          <div className="w-3 h-3 rounded-full bg-blood-500" />
          <span className="text-xs text-white/60">Hospital</span>
        </div>
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-white/60">Donor</span>
        </div>
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-white/60">You</span>
        </div>
      </div>
    </div>
  )
}

export default function FindBlood() {
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [contacted, setContacted] = useState(new Set())

  const filtered = results.filter(r =>
    (selectedGroup === 'All' || r.blood === selectedGroup) &&
    (search === '' || r.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-syne text-2xl sm:text-4xl font-black text-white mb-2">Find Blood</h1>
            <p className="text-white/40 text-sm sm:text-base">Real-time blood availability near your location</p>
          </motion.div>

          {/* Search + Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-3 mb-6"
          >
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Search hospital or donor name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full glass border border-white/10 focus:border-blood-500/50 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blood-500 text-white font-medium px-4 sm:px-5 py-3 rounded-xl hover:bg-blood-600 transition-colors glow-red-sm text-sm sm:text-base w-full md:w-auto"
            >
              🚨 Emergency Request
            </motion.button>
          </motion.div>

          {/* Blood group filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6"
          >
            {bloodGroups.map(bg => (
              <motion.button
                key={bg}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGroup(bg)}
                className={`shrink-0 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  selectedGroup === bg
                    ? 'bg-blood-500/20 border-blood-500 text-blood-400'
                    : 'glass border-white/10 text-white/50 hover:border-white/20'
                }`}
              >
                {bg}
              </motion.button>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Results */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/40 text-sm">{filtered.length} results found</p>
                <div className="flex items-center gap-2 text-white/30 text-xs">
                  <MapPin size={12} /> <span>Mumbai, MH</span>
                </div>
              </div>

              {filtered.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass rounded-2xl p-3 sm:p-5 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <BloodBadge type={r.blood} glow />
                      <div>
                        <p className="text-white font-medium">{r.name}</p>
                        <p className="text-white/30 text-xs mt-0.5">{r.time} · {r.units} unit{r.units > 1 ? 's' : ''} needed</p>
                      </div>
                    </div>
                    <UrgencyTag level={r.urgency} />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin size={14} className="text-blood-400" />
                      <span>{r.dist} away</span>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setContacted(prev => new Set(prev).add(r.id))}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                          contacted.has(r.id) ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'glass text-white/60 hover:text-white'
                        }`}
                      >
                        <Phone size={12} />
                        {contacted.has(r.id) ? 'Contacted' : 'Call'}
                      </motion.button>
                      <motion.button
                        whileHover={{ boxShadow: '0 0 15px rgba(239,68,68,0.3)' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blood-500/20 text-blood-400 border border-blood-500/30 hover:bg-blood-500/30 transition-all"
                      >
                        <MessageCircle size={12} />
                        Message
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 h-[300px] sm:h-[500px] rounded-2xl overflow-hidden border border-white/10"
              >
                <MapSimulation results={results} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <EmergencyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </PageEnter>
  )
}
