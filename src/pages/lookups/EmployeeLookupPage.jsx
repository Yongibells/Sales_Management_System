import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function EmployeeLookupPage() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('employee')
      .select('*')
      .then(({ data }) => {
        setEmployees(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = employees.filter(e =>
    e.lastname?.toLowerCase().includes(search.toLowerCase()) ||
    e.firstname?.toLowerCase().includes(search.toLowerCase()) ||
    e.empno?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold"
          style={{ color: '#00ff50', fontFamily: 'monospace' }}>
          Employee Lookup
        </h1>
        <p className="text-sm mt-1"
          style={{ color: 'rgba(0,255,80,0.5)' }}>
          View only — no modifications allowed
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or employee no..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg p-3 text-sm outline-none font-mono"
          style={{
            background: 'rgba(0,255,80,0.04)',
            border: '1px solid rgba(0,255,80,0.2)',
            color: '#b0ffb0'
          }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="font-mono" style={{ color: 'rgba(0,255,80,0.5)' }}>
          Loading...
        </p>
      ) : (
        <div className="rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(0,255,80,0.2)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(0,255,80,0.1)' }}>
                <th className="p-3 text-left font-mono"
                  style={{ color: 'rgba(0,255,80,0.8)' }}>Emp No</th>
                <th className="p-3 text-left font-mono"
                  style={{ color: 'rgba(0,255,80,0.8)' }}>Last Name</th>
                <th className="p-3 text-left font-mono"
                  style={{ color: 'rgba(0,255,80,0.8)' }}>First Name</th>
                <th className="p-3 text-left font-mono"
                  style={{ color: 'rgba(0,255,80,0.8)' }}>Gender</th>
                <th className="p-3 text-left font-mono"
                  style={{ color: 'rgba(0,255,80,0.8)' }}>Hire Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.empno}
                  style={{
                    background: i % 2 === 0 ? 'rgba(0,255,80,0.02)' : 'transparent',
                    borderTop: '1px solid rgba(0,255,80,0.1)'
                  }}>
                  <td className="p-3 font-mono"
                    style={{ color: '#00ff50' }}>{e.empno}</td>
                  <td className="p-3 font-mono"
                    style={{ color: '#b0ffb0' }}>{e.lastname}</td>
                  <td className="p-3 font-mono"
                    style={{ color: '#b0ffb0' }}>{e.firstname}</td>
                  <td className="p-3 font-mono"
                    style={{ color: '#b0ffb0' }}>{e.gender}</td>
                  <td className="p-3 font-mono"
                    style={{ color: 'rgba(0,255,80,0.6)' }}>{e.hiredate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 font-mono text-xs"
            style={{
              color: 'rgba(0,255,80,0.4)',
              borderTop: '1px solid rgba(0,255,80,0.1)'
            }}>
            {filtered.length} records found
          </div>
        </div>
      )}
    </div>
  )
}