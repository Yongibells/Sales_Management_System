import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import AddSaleModal from '../components/sales/AddSaleModal'
import EditSaleModal from '../components/sales/EditSaleModal'
import DeleteSaleDialog from '../components/sales/DeleteSaleDialog'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingSpinner from '../components/LoadingSpinner'

function SalesListContent() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editSale, setEditSale] = useState(null)
  const [deleteSale, setDeleteSale] = useState(null)

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('sales_with_lookup')
      .select('*')
      .order('salesdate', { ascending: false })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSales(data || [])
    setLoading(false)
  }

  const filtered = sales.filter(s => {
    const matchSearch = s.custname?.toLowerCase().includes(search.toLowerCase()) ||
      s.transno?.toLowerCase().includes(search.toLowerCase())
    const matchFrom = dateFrom ? s.salesdate >= dateFrom : true
    const matchTo = dateTo ? s.salesdate <= dateTo : true
    return matchSearch && matchFrom && matchTo
  })

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="p-6 font-mono" style={{ color: 'rgba(255,80,80,0.8)' }}>
      <p>Error: {error}</p>
      <button
        onClick={fetchSales}
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold"
            style={{ color: '#00ff50', fontFamily: 'monospace' }}>
            Sales Transactions
          </h1>
          <p className="text-sm mt-1"
            style={{ color: 'rgba(0,255,80,0.5)' }}>
            All sales records
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: 'linear-gradient(135deg, #00cc40, #00ff50)',
            color: '#030d03',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: '12px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '1px'
          }}>
          + ADD TRANSACTION
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by customer or trans no..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg p-3 text-sm outline-none font-mono"
          style={{
            background: 'rgba(0,255,80,0.04)',
            border: '1px solid rgba(0,255,80,0.2)',
            color: '#b0ffb0',
            minWidth: '280px'
          }}
        />
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          className="rounded-lg p-3 text-sm outline-none font-mono"
          style={{
            background: 'rgba(0,255,80,0.04)',
            border: '1px solid rgba(0,255,80,0.2)',
            color: '#b0ffb0',
            colorScheme: 'dark'
          }}
        />
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          className="rounded-lg p-3 text-sm outline-none font-mono"
          style={{
            background: 'rgba(0,255,80,0.04)',
            border: '1px solid rgba(0,255,80,0.2)',
            color: '#b0ffb0',
            colorScheme: 'dark'
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
                style={{ color: 'rgba(0,255,80,0.8)' }}>Trans No</th>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }}>Date</th>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }}>Customer</th>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }}>Employee</th>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }}>Items</th>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }}>Total</th>
              <th className="p-3 text-left font-mono"
                style={{ color: 'rgba(0,255,80,0.8)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center font-mono"
                  style={{ color: 'rgba(0,255,80,0.4)' }}>
                  No transactions found
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => (
                <tr key={s.transno}
                  style={{
                    background: i % 2 === 0 ? 'rgba(0,255,80,0.02)' : 'transparent',
                    borderTop: '1px solid rgba(0,255,80,0.1)'
                  }}>
                  <td className="p-3 font-mono"
                    style={{ color: '#00ff50' }}>{s.transno}</td>
                  <td className="p-3 font-mono"
                    style={{ color: '#b0ffb0' }}>{s.salesdate}</td>
                  <td className="p-3 font-mono"
                    style={{ color: '#b0ffb0' }}>{s.custname}</td>
                  <td className="p-3 font-mono"
                    style={{ color: '#b0ffb0' }}>{s.empname}</td>
                  <td className="p-3 font-mono text-center"
                    style={{ color: '#b0ffb0' }}>{s.itemcount}</td>
                  <td className="p-3 font-mono"
                    style={{ color: '#00ff50' }}>
                    {Number(s.totalamount || 0).toLocaleString('en-PH', {
                      style: 'currency', currency: 'PHP'
                    })}
                  </td>
                  <td className="p-3">
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setEditSale(s)}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(0,255,80,0.3)',
                          color: 'rgba(0,255,80,0.7)',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>
                        EDIT
                      </button>
                      <button
                        onClick={() => setDeleteSale(s)}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(255,80,80,0.3)',
                          color: 'rgba(255,100,100,0.7)',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>
                        DELETE
                      </button>
                    </div>
                  </td>
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
          {filtered.length} transactions found
        </div>
      </div>

      {/* Modals */}
      {showAdd && (
        <AddSaleModal
          onClose={() => setShowAdd(false)}
          onSaved={fetchSales}
        />
      )}
      {editSale && (
        <EditSaleModal
          sale={editSale}
          onClose={() => setEditSale(null)}
          onSaved={fetchSales}
        />
      )}
      {deleteSale && (
        <DeleteSaleDialog
          sale={deleteSale}
          onClose={() => setDeleteSale(null)}
          onDeleted={fetchSales}
        />
      )}
    </div>
  )
}

export default function SalesListPage() {
  return (
    <ErrorBoundary>
      <SalesListContent />
    </ErrorBoundary>
  )
}