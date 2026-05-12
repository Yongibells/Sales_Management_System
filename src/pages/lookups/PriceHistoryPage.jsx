import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function PriceHistoryPage() {
  const [prices, setPrices] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('pricehist')
      .select('*')
      .order('effdate', { ascending: false })
      .then(({ data }) => {
        setPrices(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = prices.filter(p =>
    p.prodcode?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold"
          style={{ color: '#00ff50', fontFamily: 'monospace' }}>
          Price History
        </h1>
        <p className="text-sm mt-1"
          style={{ color: 'rgba(0,255,80,0.5)' }}>
          View only — no modifications allowed
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by product code..."
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

      {loading ? (
        <p className="font-mono" style={{ color: 'rgba(0,255,80,0.5)' }}>Loading...</p>
      ) : (
        <div className="rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(0,255,80,0.2)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(0,255,80,0.1)' }}>
                <th className="p-3 text-left font-mono"
                  style={{ color: 'rgba(0,255,80,0.8)' }}>Prod Code</th>
                <th className="p-3 text-left font-mono"
                  style={{ color: 'rgba(0,255,80,0.8)' }}>Effective Date</th>
                <th className="p-3 text-left font-mono"
                  style={{ color: 'rgba(0,255,80,0.8)' }}>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={`${p.prodcode}-${p.effdate}`}
                  style={{
                    background: i % 2 === 0 ? 'rgba(0,255,80,0.02)' : 'transparent',
                    borderTop: '1px solid rgba(0,255,80,0.1)'
                  }}>
                  <td className="p-3 font-mono"
                    style={{ color: '#00ff50' }}>{p.prodcode}</td>
                  <td className="p-3 font-mono"
                    style={{ color: 'rgba(0,255,80,0.6)' }}>{p.effdate}</td>
                  <td className="p-3 font-mono"
                    style={{ color: '#b0ffb0' }}>
                    {Number(p.unitprice).toLocaleString('en-PH', {
                      style: 'currency', currency: 'PHP'
                    })}
                  </td>
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