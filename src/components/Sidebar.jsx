import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Sales', path: '/sales', icon: '📋' },
  { label: 'Customers', path: '/lookups/customers', icon: '👥' },
  { label: 'Employees', path: '/lookups/employees', icon: '👤' },
  { label: 'Products', path: '/lookups/products', icon: '📦' },
  { label: 'Prices', path: '/lookups/prices', icon: '💰' },
  { label: 'Reports', path: '/reports', icon: '📊' },
  { label: 'Admin', path: '/admin', icon: '⚙️' },
  { label: 'Deleted Items', path: '/deleted-items', icon: '🗑️' },
]

export default function Sidebar() {
  return (
    <div style={{
      width: '220px',
      minHeight: '100vh',
      background: 'rgba(5, 18, 5, 0.95)',
      borderRight: '1px solid rgba(0,255,80,0.15)',
      paddingTop: '20px',
      flexShrink: 0,
    }}>

      {/* Sales group */}
      <div style={{ marginBottom: '8px' }}>
        <p style={{
          color: 'rgba(0,255,80,0.35)',
          fontFamily: 'monospace',
          fontSize: '10px',
          letterSpacing: '2px',
          padding: '0 16px',
          marginBottom: '4px'
        }}>SALES</p>
        <SidebarLink path="/sales" label="Transactions" />
      </div>

      {/* Lookups group */}
      <div style={{ marginBottom: '8px' }}>
        <p style={{
          color: 'rgba(0,255,80,0.35)',
          fontFamily: 'monospace',
          fontSize: '10px',
          letterSpacing: '2px',
          padding: '0 16px',
          marginBottom: '4px'
        }}>LOOKUPS</p>
        <SidebarLink path="/lookups/customers" label="Customers" />
        <SidebarLink path="/lookups/employees" label="Employees" />
        <SidebarLink path="/lookups/products" label="Products" />
        <SidebarLink path="/lookups/prices" label="Price History" />
      </div>

      {/* Other group */}
      <div>
        <p style={{
          color: 'rgba(0,255,80,0.35)',
          fontFamily: 'monospace',
          fontSize: '10px',
          letterSpacing: '2px',
          padding: '0 16px',
          marginBottom: '4px'
        }}>OTHER</p>
        <SidebarLink path="/reports" label="Reports" />
        <SidebarLink path="/admin" label="Admin" />
        <SidebarLink path="/deleted-items" label="Deleted Items" />
      </div>

    </div>
  )
}

function SidebarLink({ path, label }) {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        display: 'block',
        padding: '9px 16px',
        fontFamily: 'monospace',
        fontSize: '13px',
        color: isActive ? '#00ff50' : 'rgba(0,255,80,0.55)',
        background: isActive ? 'rgba(0,255,80,0.07)' : 'transparent',
        borderLeft: isActive ? '2px solid #00ff50' : '2px solid transparent',
        textDecoration: 'none',
        transition: 'all 0.15s',
      })}
      onMouseEnter={e => {
        e.currentTarget.style.color = '#00ff50'
        e.currentTarget.style.background = 'rgba(0,255,80,0.05)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'rgba(0,255,80,0.55)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {label}
    </NavLink>
  )
}