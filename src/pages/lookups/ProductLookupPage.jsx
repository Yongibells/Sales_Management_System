import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ErrorBoundary from '../../components/ErrorBoundary'
import LoadingSpinner from '../../components/LoadingSpinner'

function ProductLookupContent() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from('product').select('*')
    if (error) { setError(error.message); setLoading(false); return }
    setProducts(data || [])
    setLoading(false)
  }

  const filtered = products.filter(p =>
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.prodcode?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner />
  if (error) return (
    <div className="p-6 font-mono" style={{ color: 'rgba(255,80,80,0.8)' }}>
      <p>Error: {error}</p>
      <button onClick={fetchProducts} style={{
        marginTop: '16px', background: 'transparent',
        border: '1px solid rgba(255,80,80,0.4)',
        color: 'rgba(255,80,80,0.8)', fontFamily: 'monospace',
        padding: '8px 16px', borderRadius: '6px', cursor: 'pointer'
      }}>Retry</button>
    </div>
  )

  return (
    <div className="p-6 font-mono">
      <h1 style={{ color: '#00ff50', letterSpacing: '2px', marginBottom: '20px' }}>
        PRODUCT LOOKUP
      </h1>

      <input
        type="text"
        placeholder="Search by name or product code..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', maxWidth: '400px',
          background: 'rgba(0,255,80,0.04)',
          border: '1px solid rgba(0,255,80,0.2)',
          color: '#b0ffb0', fontFamily: 'monospace',
          fontSize: '13px', padding: '10px 12px',
          borderRadius: '8px', outline: 'none', marginBottom: '20px'
        }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(0,255,80,0.2)' }}>
            {['Prod Code', 'Description', 'Unit'].map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '10px',
                color: 'rgba(0,255,80,0.6)', fontSize: '11px',
                letterSpacing: '1px', textTransform: 'uppercase'
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.prodcode} style={{ borderBottom: '1px solid rgba(0,255,80,0.08)' }}>
              <td style={{ padding: '10px', color: '#b0ffb0', fontSize: '13px' }}>{p.prodcode}</td>
              <td style={{ padding: '10px', color: '#b0ffb0', fontSize: '13px' }}>{p.description}</td>
              <td style={{ padding: '10px', color: '#b0ffb0', fontSize: '13px' }}>{p.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p style={{ color: 'rgba(0,255,80,0.4)', marginTop: '20px', fontSize: '13px' }}>
          No products found.
        </p>
      )}
    </div>
  )
}

export default function ProductLookupPage() {
  return (
    <ErrorBoundary>
      <ProductLookupContent />
    </ErrorBoundary>
  )
}
