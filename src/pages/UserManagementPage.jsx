import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingSpinner from '../components/LoadingSpinner'

function UserManagementContent() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .order('user_type', { ascending: false })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setUsers(data || [])
    setLoading(false)
  }

  const handleActivate = async (userId) => {
    const { error } = await supabase
      .from('user')
      .update({ record_status: 'ACTIVE' })
      .eq('userid', userId)
    if (error) {
      alert('Failed to activate user: ' + error.message)
      return
    }
    fetchUsers()
  }

  const handleDeactivate = async (userId) => {
    const { error } = await supabase
      .from('user')
      .update({ record_status: 'INACTIVE' })
      .eq('userid', userId)
    if (error) {
      alert('Failed to deactivate user: ' + error.message)
      return
    }
    fetchUsers()
  }

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="p-6 font-mono" style={{ color: 'rgba(255,80,80,0.8)' }}>
      <p>Error: {error}</p>
      <button onClick={fetchUsers} style={{
        marginTop: '16px', background: 'transparent',
        border: '1px solid rgba(255,80,80,0.4)', color: 'rgba(255,80,80,0.7)',
        fontFamily: 'monospace', fontSize: '11px', padding: '6px 14px',
        borderRadius: '4px', cursor: 'pointer'
      }}>RETRY</button>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold"
          style={{ color: '#00ff50', fontFamily: 'monospace' }}>
          User Management
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(0,255,80,0.5)' }}>
          Activate or deactivate user accounts
        </p>
      </div>

      <div className="rounded-lg overflow-hidden"
        style={{ border: '1px solid rgba(0,255,80,0.2)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(0,255,80,0.1)' }}>
              {['Email', 'Username', 'User Type', 'Status', 'Actions'].map(h => (
                <th key={h} className="p-3 text-left font-mono"
                  style={{ color: 'rgba(0,255,80,0.8)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center font-mono"
                  style={{ color: 'rgba(0,255,80,0.4)' }}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u, i) => {
                const isSuperAdmin = u.user_type === 'SUPERADMIN'
                return (
                  <tr key={u.userid}
                    style={{
                      background: isSuperAdmin
                        ? 'rgba(0,255,80,0.05)'
                        : i % 2 === 0 ? 'rgba(0,255,80,0.02)' : 'transparent',
                      borderTop: '1px solid rgba(0,255,80,0.1)',
                      opacity: isSuperAdmin ? 0.6 : 1
                    }}>
                    <td className="p-3 font-mono"
                      style={{ color: '#b0ffb0' }}>{u.email}</td>
                    <td className="p-3 font-mono"
                      style={{ color: '#b0ffb0' }}>{u.username || '—'}</td>
                    <td className="p-3 font-mono"
                      style={{ color: '#00ff50' }}>{u.user_type}</td>
                    <td className="p-3 font-mono">
                      <span style={{
                        color: u.record_status === 'ACTIVE'
                          ? '#00ff50' : 'rgba(255,80,80,0.8)',
                        fontSize: '11px'
                      }}>
                        {u.record_status}
                      </span>
                    </td>
                    <td className="p-3">
                      {isSuperAdmin ? (
                        <span
                          title="SUPERADMIN accounts cannot be modified"
                          style={{
                            color: 'rgba(0,255,80,0.3)',
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            cursor: 'not-allowed'
                          }}>
                          PROTECTED
                        </span>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleActivate(u.userid)}
                            disabled={u.record_status === 'ACTIVE'}
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(0,255,80,0.3)',
                              color: u.record_status === 'ACTIVE'
                                ? 'rgba(0,255,80,0.2)' : 'rgba(0,255,80,0.7)',
                              fontFamily: 'monospace', fontSize: '11px',
                              padding: '4px 10px', borderRadius: '4px',
                              cursor: u.record_status === 'ACTIVE'
                                ? 'not-allowed' : 'pointer'
                            }}>
                            ACTIVATE
                          </button>
                          <button
                            onClick={() => handleDeactivate(u.userid)}
                            disabled={u.record_status === 'INACTIVE'}
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(255,80,80,0.3)',
                              color: u.record_status === 'INACTIVE'
                                ? 'rgba(255,80,80,0.2)' : 'rgba(255,100,100,0.7)',
                              fontFamily: 'monospace', fontSize: '11px',
                              padding: '4px 10px', borderRadius: '4px',
                              cursor: u.record_status === 'INACTIVE'
                                ? 'not-allowed' : 'pointer'
                            }}>
                            DEACTIVATE
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        <div className="p-3 font-mono text-xs"
          style={{
            color: 'rgba(0,255,80,0.4)',
            borderTop: '1px solid rgba(0,255,80,0.1)'
          }}>
          {users.length} users found
        </div>
      </div>
    </div>
  )
}

export default function UserManagementPage() {
  return (
    <ErrorBoundary>
      <UserManagementContent />
    </ErrorBoundary>
  )
}