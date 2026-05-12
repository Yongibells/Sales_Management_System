import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ErrorBoundary from '../../components/ErrorBoundary'
import LoadingSpinner from '../../components/LoadingSpinner'

function EmployeeLookupContent() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from('employee').select('*')
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setEmployees(data || [])
    setLoading(false)
  }

  const filtered = employees.filter(e =>
    e.lastname?.toLowerCase().includes(search.toLowerCase()) ||
    e.firstname?.toLowerCase().includes(search.toLowerCase()) ||
    e.empno?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="p-6 font-mono" style={{ color: 'rgba(255,80,80,0.8)' }}>
      <p>Error: {error}</p>
      <button
        onClick={fetchEmployees}
        style={{
          marginTop: '16px',
          background: 'transparent',
          border: '1px solid rgba(255,80,80,0.4)',
          color: 'rgba(255,80,80,0.7)',
          fontFamily: 'monospace',
          fontSize: '11px',
          padding: '6px 14px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
        RETRY
      </button>
    </div>
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
      <div className="rounded-lg overflow-hidden"
        style={{ border: '1px solid rgba(0,255,80,0.2)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(0,255,80,0.1)' }}>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }}>Emp No</th>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }