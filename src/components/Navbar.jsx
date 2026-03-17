import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Bell, ChevronDown } from 'lucide-react'
import LogoMark from './LogoMark'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/find-blood', label: 'Find Blood' },
    { to: '/community', label: 'Community' },
    { to: '/about', label: 'About' },
  ]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-white/5 py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blood-500 flex items-center justify-center glow-red-sm"
          >
            <LogoMark className="w-6 h-6" />
          </motion.div>
          <span
            className={`font-syne font-extrabold text-xl sm:text-2xl tracking-tight ${
              scrolled ? 'text-gray-900' : 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]'
            }`}
          >
            Rudhir<span className="text-blood-500">Setu</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors duration-200 hover:text-blood-500 ${
                location.pathname === to ? 'text-blood-500' : 'text-gray-600'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Sign In
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(239,68,68,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="text-sm font-medium bg-blood-500 hover:bg-blood-600 text-white px-5 py-2 rounded-xl transition-all duration-200"
            >
              Get Started
            </motion.button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-900"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-gray-200 px-6 py-4 flex flex-col gap-4"
          >
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2 border-t border-gray-200">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <button className="w-full text-sm py-2.5 rounded-xl glass text-gray-700">Sign In</button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                <button className="w-full text-sm py-2.5 rounded-xl bg-blood-500 text-white font-medium">Get Started</button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
