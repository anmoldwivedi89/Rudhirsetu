import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import LogoMark from './LogoMark'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user, profile, role, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const links = useMemo(
    () => [
      { to: '/', label: 'Home', end: true },
      { to: '/find-blood', label: 'Find Blood' },
      { to: '/community', label: 'Community' },
      { to: '/about', label: 'About' },
      { to: '/developers', label: 'Developers' },
    ],
    []
  )

  const navItemClass = ({ isActive }) =>
    [
      'group relative inline-flex items-center justify-center',
      'text-sm lg:text-[15px] font-medium tracking-tight',
      'transition-colors duration-300',
      isActive ? 'text-white' : 'text-white/70 hover:text-white',
      isActive ? 'drop-shadow-[0_0_18px_rgba(239,68,68,0.18)]' : '',
    ].join(' ')

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={[
        'sticky top-0 z-50 w-full',
        'transition-all duration-500',
        'backdrop-blur-md',
        'bg-[rgba(10,10,10,0.60)]',
        'border-b border-white/[0.08]',
        scrolled
          ? 'shadow-[0_14px_40px_rgba(0,0,0,0.55)] py-3'
          : 'shadow-[0_10px_30px_rgba(0,0,0,0.35)] py-4 sm:py-5',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blood-500/90 flex items-center justify-center"
          >
            <span className="pointer-events-none absolute -inset-2 rounded-2xl bg-blood-500/25 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <LogoMark className="w-6 h-6" />
          </motion.div>
          <span className="font-syne font-extrabold text-xl sm:text-2xl tracking-tight text-white">
            Rudhir
            <span className="bg-gradient-to-r from-blood-500 via-red-300 to-blood-500 bg-clip-text text-transparent">
              Setu
            </span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center justify-center gap-8 lg:gap-10">
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={navItemClass}>
              <span className="relative">
                {label}
                <span className="pointer-events-none absolute left-0 -bottom-2 h-[2px] w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-blood-500 via-red-300 to-blood-500 transition-transform duration-300 group-hover:scale-x-100 group-[[aria-current=page]]:scale-x-100" />
              </span>
              <span className="pointer-events-none absolute -inset-3 rounded-2xl bg-white/[0.06] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {profile?.name || user.email || 'Signed in'}
                  </span>
                  {role && (
                    <span className="text-[11px] text-white/60">
                      {role === 'donor' && 'Donor'}
                      {role === 'patient' && 'Patient'}
                      {role === 'hospital' && 'Hospital'}
                      {role === 'admin' && 'Admin'}
                      {!['donor','patient','hospital','admin'].includes(role) && role}
                    </span>
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={logout}
                className="text-sm text-white/80 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/[0.06]"
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-sm text-white/80 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/[0.06]"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239,68,68,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  className="text-sm font-semibold text-white px-5 py-2 rounded-xl transition-all duration-300 bg-gradient-to-r from-blood-500 via-red-500 to-blood-600 hover:shadow-red-500/30"
                >
                  Get Started
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.10] bg-white/[0.06] text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              className="md:hidden fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              className="md:hidden fixed top-[calc(var(--nav-h,64px))] left-0 right-0 z-50 px-4 pb-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ ['--nav-h']: scrolled ? '60px' : '72px' }}
            >
              <div className="overflow-hidden rounded-3xl border border-white/[0.10] bg-[rgba(12,12,12,0.92)] shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl">
                <div className="px-4 py-4">
                  <div className="flex flex-col">
                    {links.map(({ to, label, end }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                          [
                            'group flex w-full items-center justify-between',
                            'rounded-2xl px-4 py-3.5',
                            'text-[15px] font-medium',
                            'transition-all duration-200',
                            'active:scale-[0.99]',
                            isActive
                              ? 'bg-white/[0.10] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_26px_rgba(239,68,68,0.18)]'
                              : 'text-white/80 hover:text-white hover:bg-white/[0.06]',
                          ].join(' ')
                        }
                        onClick={() => setMobileOpen(false)}
                      >
                        <span>{label}</span>
                        <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blood-500 to-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </NavLink>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-white/[0.08] pt-4">
                    {user ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/[0.10] bg-white/[0.06] px-4 py-3">
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-semibold text-white">
                              {profile?.name || user.email || 'Signed in'}
                            </span>
                            {role && (
                              <span className="text-[11px] text-white/60 mt-0.5">
                                {role === 'donor' && 'Donor'}
                                {role === 'patient' && 'Patient'}
                                {role === 'hospital' && 'Hospital'}
                                {role === 'admin' && 'Admin'}
                                {!['donor','patient','hospital','admin'].includes(role) && role}
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { logout(); setMobileOpen(false) }}
                          className="w-full rounded-2xl border border-white/[0.10] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/85 hover:text-white transition-colors"
                        >
                          Sign Out
                        </motion.button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Link to="/login" onClick={() => setMobileOpen(false)}>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="w-full rounded-2xl border border-white/[0.10] bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white/85 hover:text-white transition-colors"
                          >
                            Sign In
                          </motion.button>
                        </Link>
                        <Link to="/register" onClick={() => setMobileOpen(false)}>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blood-500 via-red-500 to-blood-600 hover:shadow-[0_14px_35px_rgba(239,68,68,0.25)]"
                          >
                            Get Started
                          </motion.button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
