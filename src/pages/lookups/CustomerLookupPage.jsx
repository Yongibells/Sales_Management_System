import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ErrorBoundary from '../../components/ErrorBoundary'
import LoadingSpinner from '../../components/LoadingSpinner'

function CustomerLookupContent() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from('customer').select('*')
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setCustomers(data || [])
    setLoading(false)
  }

  const filtered = customers.filter(c =>
    c.custname?.toLowerCase().includes(search.toLowerCase()) ||
    c.custno?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="p-6 font-mono" style={{ color: 'rgba(255,80,80,0.8)' }}>
      <p>Error: {error}</p>
      <button
        onClick={fetchCustomers}
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
          Customer Lookup
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
          placeholder="Search by name or customer no..."
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
                style={{ color: 'rgba(0,255,80,0.8)' }}>Cust No</th>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }}>Customer Name</th>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }}>Address</th>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }}>Pay Term</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center font-mono"
                  style={{ color: 'rgba(0,255,80,0.4)' }}>
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <tr key={c.custno}
                  style={{
                    background: i % 2 === 0 ? 'rgba(0,255,80,0.02)' : 'transparent',
                    borderTop: '1px solid rgba(0,255,80,0.1)'
                  }}>
                  <td className="p-3 font-mono"
                    style={{ color: '#00ff50' }}>{c.custno}</td>
                  <td className="p-3 font-mono"
                    style={{ color: '#b0ffb0' }}>{c.custname}</td>
                  <td className="p-3 font-mono text-xs"
                    style={{ color: 'rgba(0,255,80,0.6)' }}>{c.address}</td>
                  <td className="p-3 font-mono"
                    style={{ color: '#b0ffb0' }}>{c.payterm}</td>
                </tr>
              ))
            )}
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
    </div>
  )
}

export default function CustomerLookupPage() {
  return (
    <ErrorBoundary>
      <CustomerLookupContent />
    </ErrorBoundary>
  )
}