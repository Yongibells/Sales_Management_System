import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/sales')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #030d03 0%, #071a07 50%, #030d03 100%)' }}>

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,80,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,80,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4"
        style={{
          background: 'rgba(5, 18, 5, 0.95)',
          border: '1px solid rgba(0,255,80,0.25)',
          borderRadius: '16px',
          boxShadow: '0 0 60px rgba(0,255,80,0.08), 0 25px 50px rgba(0,0,0,0.6)'
        }}>

        {/* Top bar */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #00ff50, transparent)',
          borderRadius: '16px 16px 0 0'
        }} />

        <div className="px-8 pb-8 pt-2">

          {/* Title */}
          <div className="text-center mb-7">
            <img
  src={logo}
  alt="Hope Inc Logo"
  className="mx-auto mb-4"
  style={{
    width: '100px',
    height: '100px',
    borderRadius: '20px',
    boxShadow: '0 0 30px rgba(0,255,80,0.3)'
  }}
/>

            <h1 className="text-2xl font-bold tracking-widest uppercase"
              style={{
                color: '#00ff50',
                textShadow: '0 0 30px rgba(0,255,80,0.5)',
                fontFamily: 'monospace'
              }}>
              HOPE, INC.
            </h1>
            <p className="text-xs tracking-widest uppercase mt-1 font-mono"
              style={{ color: 'rgba(0,255,80,0.4)' }}>
              Sales Management System
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-xs p-3 rounded-lg mb-4 font-mono text-center"
              style={{
                background: 'rgba(255,50,50,0.08)',
                border: '1px solid rgba(255,80,80,0.3)',
                color: '#ff6464'
              }}>
              ✗ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2"
                style={{ color: 'rgba(0,255,80,0.6)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg p-3 text-sm outline-none font-mono"
                style={{
                  background: 'rgba(0,255,80,0.04)',
                  border: '1px solid rgba(0,255,80,0.2)',
                  color: '#b0ffb0',
                  caretColor: '#00ff50'
                }}
                onFocus={e => {
                  e.target.style.border = '1px solid rgba(0,255,80,0.7)'
                  e.target.style.boxShadow = '0 0 15px rgba(0,255,80,0.1)'
                }}
                onBlur={e => {
                  e.target.style.border = '1px solid rgba(0,255,80,0.2)'
                  e.target.style.boxShadow = 'none'
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2"
                style={{ color: 'rgba(0,255,80,0.6)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg p-3 text-sm outline-none font-mono"
                style={{
                  background: 'rgba(0,255,80,0.04)',
                  border: '1px solid rgba(0,255,80,0.2)',
                  color: '#b0ffb0',
                  caretColor: '#00ff50'
                }}
                onFocus={e => {
                  e.target.style.border = '1px solid rgba(0,255,80,0.7)'
                  e.target.style.boxShadow = '0 0 15px rgba(0,255,80,0.1)'
                }}
                onBlur={e => {
                  e.target.style.border = '1px solid rgba(0,255,80,0.2)'
                  e.target.style.boxShadow = 'none'
                }}
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-sm font-bold tracking-widest uppercase font-mono mt-2"
              style={{
                background: 'linear-gradient(135deg, #00cc40, #00ff50)',
                color: '#030d03',
                boxShadow: '0 0 25px rgba(0,255,80,0.3)'
              }}
              onMouseEnter={e => {
                e.target.style.boxShadow = '0 0 40px rgba(0,255,80,0.6)'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.target.style.boxShadow = '0 0 25px rgba(0,255,80,0.3)'
                e.target.style.transform = 'translateY(0)'
              }}
disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow h-px"
              style={{ background: 'rgba(0,255,80,0.12)' }} />
            <span className="mx-3 text-xs font-mono"
              style={{ color: 'rgba(0,255,80,0.35)' }}>OR</span>
            <div className="flex-grow h-px"
              style={{ background: 'rgba(0,255,80,0.12)' }} />
          </div>

          {/* Google Button */}
          <button
            onClick={() => console.log('Google login')}
            className="w-full py-3 rounded-lg text-sm font-mono tracking-wide flex items-center justify-center gap-3"
            style={{
              background: 'rgba(0,255,80,0.04)',
              border: '1px solid rgba(0,255,80,0.2)',
              color: '#b0ffb0'
            }}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(0,255,80,0.08)'
              e.target.style.border = '1px solid rgba(0,255,80,0.4)'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'rgba(0,255,80,0.04)'
              e.target.style.border = '1px solid rgba(0,255,80,0.2)'
            }}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-4 h-4"
            />
            Sign in with Google
          </button>

          {/* Register link */}
          <p className="text-center text-xs font-mono mt-5"
            style={{ color: 'rgba(0,255,80,0.35)' }}>
            No account?{' '}
            <a href="/register"
              style={{ color: '#00ff50' }}
              onMouseEnter={e => e.target.style.textShadow = '0 0 10px rgba(0,255,80,0.8)'}
              onMouseLeave={e => e.target.style.textShadow = 'none'}
            >
              Register here
            </a>
          </p>

        </div>

        {/* Bottom bar */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #00ff50, transparent)',
          borderRadius: '0 0 16px 16px'
        }} />

      </div>
    </div>
  )
}