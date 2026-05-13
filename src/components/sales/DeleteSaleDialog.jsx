import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function DeleteSaleDialog({ sale, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    const { error: err } = await supabase
      .from('sales')
      .update({ record_status: 'INACTIVE' })
      .eq('transno', sale.transno)
    setLoading(false)

    if (err) return setError(err.message)
    onDeleted()
    onClose()
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
        border: '1px solid rgba(255,80,80,0.3)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '380px',
        overflowY: 'auto',
maxHeight: '90vh',
        padding: '28px',
      }}>

        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #ff4444, transparent)',
          borderRadius: '2px',
          marginBottom: '20px'
        }} />

        <h2 style={{
          color: '#ff6464', fontFamily: 'monospace',
          fontSize: '16px', fontWeight: 'bold',
          letterSpacing: '2px', marginBottom: '12px'
        }}>
          CONFIRM DELETE
        </h2>

        <p style={{
          color: '#b0ffb0', fontFamily: 'monospace',
          fontSize: '13px', marginBottom: '24px',
          lineHeight: '1.6'
        }}>
          Delete transaction <span style={{ color: '#00ff50' }}>{sale?.transno}</span>?
          This will also deactivate all its line items.
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

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose}
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
          <button onClick={handleDelete} disabled={loading}
            style={{
              flex: 1, padding: '10px',
              background: 'rgba(255,50,50,0.15)',
              border: '1px solid rgba(255,80,80,0.4)',
              color: '#ff6464',
              fontFamily: 'monospace', fontSize: '12px',
              fontWeight: 'bold', borderRadius: '8px',
              cursor: 'pointer', letterSpacing: '1px'
            }}>
            {loading ? 'DELETING...' : 'CONFIRM DELETE'}
          </button>
        </div>

      </div>
    </div>
  )
}