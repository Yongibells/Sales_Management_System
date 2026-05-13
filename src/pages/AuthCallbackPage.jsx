import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/sales')
      }
    })
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #030d03 0%, #071a07 50%, #030d03 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(0,255,80,0.15)',
        borderTop: '3px solid #00ff50',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '24px',
      }} />
      <p style={{
        color: '#00ff50',
        fontSize: '14px',
        letterSpacing: '2px',
      }}>
        AUTHENTICATING...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}