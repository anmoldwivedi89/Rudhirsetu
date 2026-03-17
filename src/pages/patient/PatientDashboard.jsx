import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Bell, Droplets, MapPin, Search } from 'lucide-react'
import { PageEnter, PageHeader, GlassCard, StatCard, RequestCard, NotifItem, PrimaryBtn } from '../../components/UI'

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const urgentRequests = [
    { id: 1, blood: 'O+', dist: '2.5 km', urgency: 'critical', hospital: 'City Care Hospital', time: '10 mins ago' },
    { id: 2, blood: 'O+', dist: '4.1 km', urgency: 'high', hospital: 'Metro Health', time: '25 mins ago' },
  ]

  const notifications = [
    { id: 1, type: 'success', message: 'Your blood request was accepted by 2 donors.', time: '1 hr ago' },
    { id: 2, type: 'info', message: 'New update on your request status.', time: '3 hrs ago' },
  ]

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col md:flex-row">
        {/* Main Content */}
        <main className="flex-1 overflow-auto pt-14 md:pt-0">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            <PageHeader
              title="Patient Dashboard"
              sub="Manage your blood requests and find donors"
              badge="Active Patient"
            />

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <PrimaryBtn className="flex-1 py-4 text-base">
                🚨 Request Blood Now
              </PrimaryBtn>
              <PrimaryBtn className="flex-1 py-4 text-base bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50">
                <Search size={18} /> Find Donors Nearby
              </PrimaryBtn>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Activity} label="Active Requests" value="1" color="red" />
              <StatCard icon={Droplets} label="Units Received" value="2" color="blue" />
              <StatCard icon={MapPin} label="Donors Reached" value="15" color="purple" />
              <StatCard icon={Bell} label="Alerts Sent" value="3" color="green" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Active Requests */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-syne text-xl font-bold text-gray-900">Active Requests</h2>
                  <button className="text-sm text-blood-500 font-medium tracking-wide hover:text-blood-600 transition-colors">View All</button>
                </div>
                {urgentRequests.map(r => (
                  <GlassCard key={r.id} className="p-4 bg-white border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                         <span className="font-syne font-bold text-blood-500 bg-red-50 px-3 py-1 rounded-lg">{r.blood}</span>
                         <div>
                            <p className="font-medium text-gray-900 leading-tight">{r.hospital}</p>
                            <p className="text-xs text-gray-500">{r.time}</p>
                         </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-md bg-red-100 text-red-600 uppercase tracking-wide">
                        {r.urgency}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">Update Status</button>
                      <button className="flex-1 py-2 text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">Cancel</button>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-syne text-xl font-bold text-gray-900">Recent Updates</h2>
                </div>
                <GlassCard className="p-2 bg-white border border-gray-100">
                  {notifications.map(n => (
                    <NotifItem key={n.id} {...n} />
                  ))}
                </GlassCard>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageEnter>
  )
}
