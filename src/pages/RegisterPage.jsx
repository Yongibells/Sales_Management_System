import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabaseClient'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '',
    email: '', password: '', confirmPassword: ''
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.firstName || !form.lastName || !form.username ||
        !form.email || !form.password || !form.confirmPassword)
      return setError('All fields are required.')
    if (form.password !== form.confirmPassword)
      return setError('Passwords do not match.')
    if (form.password.length < 8)
      return setError('Password must be at least 8 characters.')

setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          username: form.username
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/login')
    setLoading(false)
  }

const handleGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        prompt: 'select_account'
      }
    }
  })
}

  const inputStyle = {
    background: 'rgba(0,255,80,0.04)',
    border: '1px solid rgba(0,255,80,0.2)',
    color: '#b0ffb0',
    caretColor: '#00ff50'
  }

  const focusInput = (e) => {
    e.target.style.border = '1px solid rgba(0,255,80,0.7)'
    e.target.style.boxShadow = '0 0 15px rgba(0,255,80,0.1)'
  }

  const blurInput = (e) => {
    e.target.style.border = '1px solid rgba(0,255,80,0.2)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #030d03 0%, #071a07 50%, #030d03 100%)' }}>

      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,80,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,80,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 w-full max-w-sm mx-4 my-8"
        style={{
          background: 'rgba(5, 18, 5, 0.95)',
          border: '1px solid rgba(0,255,80,0.25)',
          borderRadius: '16px',
          boxShadow: '0 0 60px rgba(0,255,80,0.08), 0 25px 50px rgba(0,0,0,0.6)'
        }}>

        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #00ff50, transparent)',
          borderRadius: '16px 16px 0 0'
        }} />

        <div className="px-8 pb-8 pt-2">

          <div className="text-center mb-7">
            <img src={logo} alt="Hope Inc Logo" className="mx-auto mb-4"
              style={{ width: '100px', height: '100px', borderRadius: '20px',
                boxShadow: '0 0 30px rgba(0,255,80,0.3)' }} />
            <h1 className="text-2xl font-bold tracking-widest uppercase"
              style={{ color: '#00ff50', textShadow: '0 0 30px rgba(0,255,80,0.5)',
                fontFamily: 'monospace' }}>
              HOPE, INC.
            </h1>
            <p className="text-xs tracking-widest uppercase mt-1 font-mono"
              style={{ color: 'rgba(0,255,80,0.4)' }}>
              Sales Management System
            </p>
          </div>

          {error && (
            <div className="text-xs p-3 rounded-lg mb-4 font-mono text-center"
              style={{ background: 'rgba(255,50,50,0.08)',
                border: '1px solid rgba(255,80,80,0.3)', color: '#ff6464' }}>
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase mb-2"
                  style={{ color: 'rgba(0,255,80,0.6)' }}>First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange}
                  placeholder="First" onFocus={focusInput} onBlur={blurInput}
                  className="w-full rounded-lg p-3 text-sm outline-none font-mono"
                  style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase mb-2"
                  style={{ color: 'rgba(0,255,80,0.6)' }}>Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange}
                  placeholder="Last" onFocus={focusInput} onBlur={blurInput}
                  className="w-full rounded-lg p-3 text-sm outline-none font-mono"
                  style={inputStyle} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2"
                style={{ color: 'rgba(0,255,80,0.6)' }}>Username</label>
              <input name="username" value={form.username} onChange={handleChange}
                placeholder="Enter your username" onFocus={focusInput} onBlur={blurInput}
                className="w-full rounded-lg p-3 text-sm outline-none font-mono"
                style={inputStyle} />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2"
                style={{ color: 'rgba(0,255,80,0.6)' }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="Enter your email" onFocus={focusInput} onBlur={blurInput}
                className="w-full rounded-lg p-3 text-sm outline-none font-mono"
                style={inputStyle} />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2"
                style={{ color: 'rgba(0,255,80,0.6)' }}>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••••••" onFocus={focusInput} onBlur={blurInput}
                className="w-full rounded-lg p-3 text-sm outline-none font-mono"
                style={inputStyle} />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2"
                style={{ color: 'rgba(0,255,80,0.6)' }}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword}
                onChange={handleChange} placeholder="••••••••••••"
                onFocus={focusInput} onBlur={blurInput}
                className="w-full rounded-lg p-3 text-sm outline-none font-mono"
                style={inputStyle} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold tracking-widest uppercase font-mono mt-2"
              style={{ background: 'linear-gradient(135deg, #00cc40, #00ff50)',
                color: '#030d03', boxShadow: '0 0 25px rgba(0,255,80,0.3)' }}
              onMouseEnter={e => {
                e.target.style.boxShadow = '0 0 40px rgba(0,255,80,0.6)'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.target.style.boxShadow = '0 0 25px rgba(0,255,80,0.3)'
                e.target.style.transform = 'translateY(0)'
              }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          <div className="flex items-center my-5">
            <div className="flex-grow h-px" style={{ background: 'rgba(0,255,80,0.12)' }} />
            <span className="mx-3 text-xs font-mono" style={{ color: 'rgba(0,255,80,0.35)' }}>OR</span>
            <div className="flex-grow h-px" style={{ background: 'rgba(0,255,80,0.12)' }} />
          </div>

          <button onClick={handleGoogle}
            className="w-full py-3 rounded-lg text-sm font-mono tracking-wide flex items-center justify-center gap-3"
            style={{ background: 'rgba(0,255,80,0.04)',
              border: '1px solid rgba(0,255,80,0.2)', color: '#b0ffb0' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,255,80,0.08)'
              e.currentTarget.style.border = '1px solid rgba(0,255,80,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0,255,80,0.04)'
              e.currentTarget.style.border = '1px solid rgba(0,255,80,0.2)'
            }}>
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Register with Google
          </button>

          <p className="text-center text-xs font-mono mt-5"
            style={{ color: 'rgba(0,255,80,0.35)' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#00ff50' }}
              onMouseEnter={e => e.target.style.textShadow = '0 0 10px rgba(0,255,80,0.8)'}
              onMouseLeave={e => e.target.style.textShadow = 'none'}>
              Sign in here
            </a>
          </p>

        </div>

        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #00ff50, transparent)',
          borderRadius: '0 0 16px 16px'
        }} />

      </div>
    </div>
  )
}