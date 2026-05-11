import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function AppShell() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #030d03 0%, #071a07 50%, #030d03 100%)',
    }}>

      {/* Grid background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,255,80,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,80,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />

      {/* Navbar at top */}
      <Navbar />

      {/* Sidebar + content */}
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{
          flex: 1,
          padding: '24px',
          color: '#b0ffb0',
          fontFamily: 'monospace',
        }}>
          <Outlet />
        </main>
      </div>

    </div>
  )
}