import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AddSaleModal({ onClose, onSaved }) {
  const [customers, setCustomers] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({
    salesdate: '',
    custno: '',
    empno: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('customer').select('custno, custname').then(({ data }) => setCustomers(data || []))
    supabase.from('employee').select('empno, firstname, lastname').then(({ data }) => setEmployees(data || []))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.salesdate || !form.custno || !form.empno)
      return setError('All fields are required.')

    setLoading(true)
    const { error: err } = await supabase
      .from('sales')
      .insert([{
        salesdate: form.salesdate,
        custno: form.custno,
        empno: form.empno,
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
        margin: '16px'
        padding: '28px',
      }}>

        {/* Top bar */}
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
          ADD TRANSACTION
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
            <label style={labelStyle}>Sales Date</label>
            <input type="date" name="salesdate" value={form.salesdate}
              onChange={handleChange} style={{ ...inputStyle, colorScheme: 'dark' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Customer</label>
            <select name="custno" value={form.custno}
              onChange={handleChange} style={inputStyle}>
              <option value="">Select customer...</option>
              {customers.map(c => (
                <option key={c.custno} value={c.custno}>{c.custname}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Employee</label>
            <select name="empno" value={form.empno}
              onChange={handleChange} style={inputStyle}>
              <option value="">Select employee...</option>
              {employees.map(e => (
                <option key={e.empno} value={e.empno}>{e.lastname}, {e.firstname}</option>
              ))}
            </select>
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
                border: 'none',
                color: '#030d03',
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