import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function HospitalRequests() {
  const [tab, setTab] = useState('active') // UI-only for now
  return (
    <div className="w-full overflow-x-hidden">
      <div className="pb-24">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-white">Requests</h1>
              <p className="text-sm text-gray-400 mt-1">Blood requests near you</p>
            </div>
            <div className="shrink-0 pt-0.5">
              <div className="px-3 py-1 text-sm rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                Hospital
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => setTab('active')}
            className={`
              flex-1 py-2 text-sm rounded-lg transition min-h-[44px]
              ${tab === 'active' ? 'bg-red-500 text-white' : 'text-gray-400'}
            `}
          >
            Active
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => setTab('closed')}
            className={`
              flex-1 py-2 text-sm rounded-lg transition min-h-[44px]
              ${tab === 'closed' ? 'bg-red-500 text-white' : 'text-gray-400'}
            `}
          >
            Closed
          </motion.button>
        </div>

        {/* Empty state */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <ClipboardList size={26} className="text-red-400" />
          </div>
          <p className="text-white font-semibold text-base">No requests right now</p>
          <p className="text-gray-400 text-sm mt-1">Create a new request or check back later</p>

          <Link to="/hospital/create-request" className="block">
            <button
              type="button"
              className="mt-4 w-full py-3 rounded-xl bg-red-500 text-white font-medium active:scale-95 transition min-h-[44px]"
            >
              Create Request
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

