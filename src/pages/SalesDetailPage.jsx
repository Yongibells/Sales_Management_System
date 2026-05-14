import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import AddLineItemModal from '../components/sales/AddLineItemModal'
import EditLineItemModal from '../components/sales/EditLineItemModal'
import { useRights } from '../context/UserRightsContext'

export default function SalesDetailPage() {
  const { transno } = useParams()
  const navigate = useNavigate()
  const [sale, setSale] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const { rights, userType } = useRights()

  useEffect(() => {
    fetchData()
  }, [transno])

  const fetchData = async () => {
    setLoading(true)
    const { data: saleData } = await supabase
      .from('sales_with_lookup')
      .select('*')
      .eq('transno', transno)
      .single()
    const { data: itemData } = await supabase
      .from('salesdetail')
      .select('*, product(description)')
      .eq('transno', transno)
      .eq('record_status', 'ACTIVE')
    setSale(saleData)
    setItems(itemData || [])
    setLoading(false)
  }

  const handleDeleteItem = async (item) => {
    if (!window.confirm('Delete this line item?')) return
    await supabase
      .from('salesdetail')
      .update({ record_status: 'INACTIVE' })
      .eq('transno', item.transno)
      .eq('prodcode', item.prodcode)
    fetchData()
  }

  const totalAmount = items.reduce((sum, item) =>
    sum + (Number(item.unitprice) * Number(item.quantity)), 0)

  if (loading) return (
    <div className="p-6 font-mono" style={{ color: 'rgba(0,255,80,0.5)' }}>
      Loading...
    </div>
  )

  if (!sale) return (
    <div className="p-6 font-mono" style={{ color: '#ff6464' }}>
      Transaction not found.
    </div>
  )

  return (
    <div className="p-6">

      <button
        onClick={() => navigate('/sales')}
        style={{
          background: 'transparent',
          border: '1px solid rgba(0,255,80,0.2)',
          color: 'rgba(0,255,80,0.6)',
          fontFamily: 'monospace',
          fontSize: '12px',
          padding: '6px 14px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px',
          letterSpacing: '1px'
        }}>
        BACK
      </button>

      <div className="mb-6 p-4 rounded-lg"
        style={{ border: '1px solid rgba(0,255,80,0.2)', background: 'rgba(0,255,80,0.03)' }}>
        <h1 className="text-xl font-bold mb-3"
          style={{ color: '#00ff50', fontFamily: 'monospace' }}>
          {sale.transno}
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div>
            <p style={{ color: 'rgba(0,255,80,0.5)', fontFamily: 'monospace', fontSize: '11px' }}>DATE</p>
            <p style={{ color: '#b0ffb0', fontFamily: 'monospace', fontSize: '13px' }}>{sale.salesdate}</p>
          </div>
          <div>
            <p style={{ color: 'rgba(0,255,80,0.5)', fontFamily: 'monospace', fontSize: '11px' }}>CUSTOMER</p>
            <p style={{ color: '#b0ffb0', fontFamily: 'monospace', fontSize: '13px' }}>{sale.custname}</p>
          </div>
          <div>
            <p style={{ color: 'rgba(0,255,80,0.5)', fontFamily: 'monospace', fontSize: '11px' }}>EMPLOYEE</p>
            <p style={{ color: '#b0ffb0', fontFamily: 'monospace', fontSize: '13px' }}>{sale.empname}</p>
          </div>
          {userType !== 'USER' && (
            <div>
              <p style={{ color: 'rgba(0,255,80,0.5)', fontFamily: 'monospace', fontSize: '11px' }}>STAMP</p>
              <p style={{ color: 'rgba(0,255,80,0.5)', fontFamily: 'monospace', fontSize: '11px' }}>{sale.stamp || '-'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 style={{ color: '#00ff50', fontFamily: 'monospace', fontSize: '14px', letterSpacing: '2px' }}>
          LINE ITEMS
        </h2>
        {rights.SD_ADD === 1 && (
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: 'linear-gradient(135deg, #00cc40, #00ff50)',
              color: '#030d03',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: '12px',
              padding: '7px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '1px'
            }}>
            + ADD LINE ITEM
          </button>
        )}
      </div>

      <div className="rounded-lg overflow-hidden mb-4"
        style={{ border: '1px solid rgba(0,255,80,0.2)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(0,255,80,0.1)' }}>
              <th className="p-3 text-left font-mono" style={{ color: 'rgba(0,255,80,0.8)' }}>Prod Code</th>
              <th className="p-3 text-left font-mono" style={{ color: 'rgba(0,255,80,0.8)' }}>Description</th>
              <th className="p-3 text-left font-mono" style={{ color: 'rgba(0,255,80,0.8)' }}>Qty</th>
              <th className="p-3 text-left font-mono" style={{ color: 'rgba(0,255,80,0.8)' }}>Unit Price</th>
              <th className="p-3 text-left font-mono" style={{ color: 'rgba(0,255,80,0.8)' }}>Total</th>
              <th className="p-3 text-left font-mono" style={{ color: 'rgba(0,255,80,0.8)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center font-mono"
                  style={{ color: 'rgba(0,255,80,0.4)' }}>
                  No line items yet
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr key={item.id || i}
                  style={{
                    background: i % 2 === 0 ? 'rgba(0,255,80,0.02)' : 'transparent',
                    borderTop: '1px solid rgba(0,255,80,0.1)'
                  }}>
                  <td className="p-3 font-mono" style={{ color: '#00ff50' }}>{item.prodcode}</td>
                  <td className="p-3 font-mono" style={{ color: '#b0ffb0' }}>{item.product?.description}</td>
                  <td className="p-3 font-mono" style={{ color: '#b0ffb0' }}>{item.quantity}</td>
                  <td className="p-3 font-mono" style={{ color: '#b0ffb0' }}>
                    {Number(item.unitprice).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                  </td>
                  <td className="p-3 font-mono" style={{ color: '#00ff50' }}>
                    {(Number(item.unitprice) * Number(item.quantity)).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                  </td>
                  <td className="p-3">
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {rights.SD_EDIT === 1 && (
                        <button
                          onClick={() => setEditItem(item)}
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
                      )}
                      {userType === 'SUPERADMIN' && rights.SD_DEL === 1 && (
                        <button
                          onClick={() => handleDeleteItem(item)}
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
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-3 flex justify-between font-mono"
          style={{ borderTop: '1px solid rgba(0,255,80,0.15)' }}>
          <span style={{ color: 'rgba(0,255,80,0.4)', fontSize: '12px' }}>
            {items.length} line items
          </span>
          <span style={{ color: '#00ff50', fontWeight: 'bold' }}>
            TOTAL: {totalAmount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
          </span>
        </div>
      </div>

      {showAdd && (
        <AddLineItemModal
          transno={transno}
          onClose={() => setShowAdd(false)}
          onSaved={fetchData}
        />
      )}
      {editItem && (
        <EditLineItemModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={fetchData}
        />
      )}
    </div>
  )
}
