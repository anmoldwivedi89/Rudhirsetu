import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, Bell, History,
  PlusCircle, ClipboardList, Users, Settings,
  LogOut, ChevronLeft, ChevronRight, Shield,
  Code, Activity, Menu, X
} from 'lucide-react'
import LogoMark from './LogoMark'
import { useAuth } from '../contexts/AuthContext'

const navGroups = {
  donor: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/donor/dashboard' },
    { icon: User, label: 'Profile', to: '/donor/profile' },
    { icon: Bell, label: 'Requests', to: '/donor/requests' },
    { icon: History, label: 'History', to: '/donor/history' },
  ],
  hospital: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/hospital/dashboard' },
    { icon: PlusCircle, label: 'Create Request', to: '/hospital/create-request' },
    { icon: ClipboardList, label: 'Track Requests', to: '/hospital/tracking' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
    { icon: Users, label: 'Users', to: '/admin/users' },
    { icon: Code, label: 'Developer', to: '/admin/developer' },
  ],
}

export default function Sidebar({ role = 'donor' }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const items = navGroups[role] || navGroups.donor

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blood-500 flex items-center justify-center glow-red-sm">
            <LogoMark className="w-5 h-5" />
          </div>
          <span className="font-syne font-extrabold text-xl tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            Rudhir<span className="text-blood-500">Setu</span>
          </span>
        </Link>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/70 p-1"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-[260px] glass border-r border-white/10 z-50 flex flex-col overflow-y-auto"
            >
              {/* Logo */}
              <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
                <div className="w-9 h-9 rounded-xl bg-blood-500 flex items-center justify-center shrink-0 glow-red-sm">
                  <LogoMark className="w-6 h-6" />
                </div>
                <span className="font-syne font-extrabold text-xl tracking-tight text-white whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                  Rudhir<span className="text-blood-500">Setu</span>
                </span>
              </div>

              {/* Nav */}
              <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
                {items.map(({ icon: Icon, label, to }) => {
                  const active = location.pathname === to
                  return (
                    <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                          active
                            ? 'bg-blood-500/20 text-blood-400 border border-blood-500/30'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon size={18} className="shrink-0" />
                        <span className="text-sm font-medium">{label}</span>
                        {active && (
                          <motion.div
                            layoutId="mobileActiveIndicator"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-blood-500"
                          />
                        )}
                      </motion.div>
                    </Link>
                  )
                })}
              </nav>

              {/* Footer */}
              <div className="px-2 py-4 border-t border-white/5">
                <motion.button
                  type="button"
                  onClick={async () => {
                    setMobileOpen(false)
                    await handleLogout()
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer text-left"
                >
                  <LogOut size={18} className="shrink-0" />
                  <span className="text-sm">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar (unchanged logic) */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col h-screen sticky top-0 glass border-r border-white/10 z-40 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-blood-500 flex items-center justify-center shrink-0 glow-red-sm">
            <LogoMark className="w-6 h-6" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-syne font-extrabold text-xl tracking-tight text-white whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
              >
                Rudhir<span className="text-blood-500">Setu</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
          {items.map(({ icon: Icon, label, to }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to}>
                <motion.div
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-blood-500/20 text-blood-400 border border-blood-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-blood-500"
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-2 py-4 border-t border-white/5 flex flex-col gap-1">
          <motion.button
            type="button"
            whileHover={{ x: 3 }}
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer text-left"
          >
            <LogOut size={18} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Collapse Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-8 h-8 rounded-lg glass text-white/40 hover:text-white mx-auto mt-2 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}
