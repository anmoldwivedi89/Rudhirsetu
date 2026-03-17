import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Droplets, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { PageEnter, PrimaryBtn } from '../components/UI'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('donor')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      window.location.href = role === 'donor' ? '/donor/dashboard' : role === 'hospital' ? '/hospital/dashboard' : '/patient/dashboard'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageEnter>
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blood-500/6 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="w-full max-w-md relative">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blood-500 flex items-center justify-center glow-red-sm">
                <Droplets size={20} className="text-white" />
              </div>
              <span className="font-syne font-black text-2xl">Rudhir<span className="text-blood-500">Setu</span></span>
            </Link>
            <h1 className="font-syne text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-white/40 text-sm mt-1">Sign in to your account</p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-8 border border-white/8"
          >
            {/* Role Tabs */}
            <div className="flex gap-2 mb-6 p-1 glass rounded-xl">
              {['donor', 'hospital', 'patient'].map(r => (
                <motion.button
                  key={r}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    role === r ? 'bg-blood-500 text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {r}
                </motion.button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">EMAIL</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-white/30" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-blood-500/60 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">PASSWORD</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-white/30" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-blood-500/60 rounded-xl pl-10 pr-10 py-3 text-white text-sm outline-none transition-colors placeholder:text-white/20"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-3.5 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a href="#" className="text-blood-400 text-xs hover:text-blood-300 transition-colors">Forgot password?</a>
              </div>

              {error && <p className="text-blood-500 text-xs text-center">{error}</p>}

              <PrimaryBtn type="submit" loading={loading} className="w-full py-3.5">
                Sign In <ArrowRight size={16} />
              </PrimaryBtn>
            </form>

            <p className="text-center text-white/40 text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blood-400 hover:text-blood-300 transition-colors font-medium">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageEnter>
  )
}
