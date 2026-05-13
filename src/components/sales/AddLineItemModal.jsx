import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AddLineItemModal({ transno, onClose, onSaved }) {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ prodcode: '', quantity: '', unitprice: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('product').select('prodcode, description')
      .then(({ data }) => setProducts(data || []))
  }, [])

  const handleProductChange = async (e) => {
    const prodcode = e.target.value
    setForm({ ...form, prodcode, unitprice: '' })

    if (prodcode) {
      const { data } = await supabase
        .from('pricehist')
        .select('unitprice')
        .eq('prodcode', prodcode)
        .order('effdate', { ascending: false })
        .limit(1)
        .single()

      if (data) setForm(prev => ({ ...prev, prodcode, unitprice: data.unitprice }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.prodcode || !form.quantity || !form.unitprice)
      return setError('All fields are required.')

    setLoading(true)
    const { error: err } = await supabase
      .from('salesdetail')
      .insert([{
        transno,
        prodcode: form.prodcode,
        quantity: Number(form.quantity),
        unitprice: Number(form.unitprice),
        record_status: 'ACTIVE'
      }])
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
        overflowY: 'auto',
maxHeight: '90vh',
        padding: '28px',
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00ff50, transparent)',
          borderRadius: '2px',
          marginBottom: '20px'
        }} />

        <h2 style={{
          color: '#00ff50', fontFamily: 'monospace',
          fontSize: '16px', fontWeight: 'bold',
          letterSpacing: '2px', marginBottom: '20px'
        }}>
          ADD LINE ITEM
        </h2>

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
            <label style={labelStyle}>Product</label>
            <select value={form.prodcode} onChange={handleProductChange} style={inputStyle}>
              <option value="">Select product...</option>
              {products.map(p => (
                <option key={p.prodcode} value={p.prodcode}>
                  {p.prodcode} — {p.description}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Quantity</label>
            <input
              type="number" min="1" value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              placeholder="Enter quantity"
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              Unit Price
              <span style={{ color: 'rgba(0,255,80,0.4)', marginLeft: '8px', fontSize: '10px' }}>
                (auto-filled from price history)
              </span>
            </label>
            <input
              type="number" value={form.unitprice}
              onChange={e => setForm({ ...form, unitprice: e.target.value })}
              placeholder="Auto-filled when product selected"
              style={{ ...inputStyle, color: form.unitprice ? '#00ff50' : 'rgba(0,255,80,0.4)' }} />
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
              {loading ? 'SAVING...' : 'SAVE'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}