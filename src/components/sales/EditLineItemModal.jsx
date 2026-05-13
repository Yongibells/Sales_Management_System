import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function EditLineItemModal({ item, onClose, onSaved }) {
  const [form, setForm] = useState({
    quantity: item?.quantity || '',
    unitprice: item?.unitprice || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.quantity || !form.unitprice)
      return setError('All fields are required.')

    setLoading(true)
    const { error: err } = await supabase
      .from('salesdetail')
      .update({
        quantity: Number(form.quantity),
        unitprice: Number(form.unitprice)
      })
      .eq('transno', item.transno)
      .eq('prodcode', item.prodcode)
    setLoading(false)

    if (err) return setError(err.message)
    onSaved()
    onClose()
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(0,255,80,0.04)',
    border: '1px solid rgba(0,255,80,0.2)',
    color: '#b0ffb0',
    fontFamily: 'monospace',
    fontSize: '13px',
    padding: '10px 12px',
    borderRadius: '8px',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    color: 'rgba(0,255,80,0.6)',
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '1px',
    marginBottom: '6px',
    textTransform: 'uppercase'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        background: 'rgba(5,18,5,0.98)',
        border: '1px solid rgba(0,255,80,0.25)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '420px',
        padding: '28px',
      }}>

        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00ff50, transparent)',
          borderRadius: '2px',
          marginBottom: '20px'
        }} />

        <h2 style={{
          color: '#00ff50', fontFamily: 'monospace',
          fontSize: '16px', fontWeight: 'bold',
          letterSpacing: '2px', marginBottom: '6px'
        }}>
          EDIT LINE ITEM
        </h2>
        <p style={{
          color: 'rgba(0,255,80,0.5)', fontFamily: 'monospace',
          fontSize: '12px', marginBottom: '20px'
        }}>
          {item?.prodcode} — {item?.product?.description}
        </p>

        {error && (
          <div style={{
            background: 'rgba(255,50,50,0.08)',
            border: '1px solid rgba(255,80,80,0.3)',
            color: '#ff6464', fontFamily: 'monospace',
            fontSize: '12px', padding: '10px',
            borderRadius: '6px', marginBottom: '16px'
          }}>
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Quantity</label>
            <input
              type="number" min="1" value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Unit Price</label>
            <input
              type="number" value={form.unitprice}
              onChange={e => setForm({ ...form, unitprice: e.target.value })}
              style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose}
              style={{
                flex: 1, padding: '10px',
                background: 'transparent',
                border: '1px solid rgba(0,255,80,0.2)',
                color: 'rgba(0,255,80,0.6)',
                fontFamily: 'monospace', fontSize: '12px',
                borderRadius: '8px', cursor: 'pointer',
                letterSpacing: '1px'
              }}>
              CANCEL
            </button>
            <button type="submit" disabled={loading}
              style={{
                flex: 1, padding: '10px',
                background: 'linear-gradient(135deg, #00cc40, #00ff50)',
                border: 'none', color: '#030d03',
                fontFamily: 'monospace', fontSize: '12px',
                fontWeight: 'bold', borderRadius: '8px',
                cursor: 'pointer', letterSpacing: '1px'
              }}>
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}