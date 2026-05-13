import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={{
      height: '60px',
      background: 'rgba(5, 18, 5, 0.95)',
      borderBottom: '1px solid rgba(0,255,80,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: '24px',
      paddingRight: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={logo} alt="Hope Inc" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
        <span style={{
          color: '#00ff50',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontSize: '14px',
          letterSpacing: '2px'
        }}>
          HOPE, INC.
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'rgba(0,255,80,0.6)', fontFamily: 'monospace', fontSize: '13px' }}>
          {currentUser?.email ?? 'user@example.com'}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid rgba(0,255,80,0.3)',
            color: 'rgba(0,255,80,0.7)',
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            letterSpacing: '1px'
          }}
          onMouseEnter={e => {
            e.target.style.border = '1px solid rgba(0,255,80,0.8)'
            e.target.style.color = '#00ff50'
          }}
          onMouseLeave={e => {
            e.target.style.border = '1px solid rgba(0,255,80,0.3)'
            e.target.style.color = 'rgba(0,255,80,0.7)'
          }}
        >
          LOGOUT
        </button>
      </div>
    </div>
  )
}
