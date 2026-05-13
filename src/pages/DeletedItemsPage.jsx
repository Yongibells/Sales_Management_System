import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function DeletedItemsPage() {
  const [activeTab, setActiveTab] = useState('transactions')
  const [transactions, setTransactions] = useState([])
  const [lineItems, setLineItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeletedItems()
  }, [])

  const fetchDeletedItems = async () => {
    setLoading(true)

    const { data: transData } = await supabase
      .from('sales_with_lookup')
      .select('*')
      .eq('record_status', 'INACTIVE')

    const { data: lineData } = await supabase
      .from('salesdetail')
      .select('*, product(description)')
      .eq('record_status', 'INACTIVE')

    setTransactions(transData || [])
    setLineItems(lineData || [])
    setLoading(false)
  }

  const recoverTransaction = async (transno) => {
    await supabase
      .from('sales')
      .update({ record_status: 'ACTIVE' })
      .eq('transno', transno)
    fetchDeletedItems()
  }

  const recoverLineItem = async (transno, prodcode) => {
    await supabase
      .from('salesdetail')
      .update({ record_status: 'ACTIVE' })
      .eq('transno', transno)
      .eq('prodcode', prodcode)
    fetchDeletedItems()
  }

  const tabStyle = (tab) => ({
    padding: '8px 20px',
    fontFamily: 'monospace',
    fontSize: '12px',
    letterSpacing: '1px',
    cursor: 'pointer',
    border: '1px solid rgba(0,255,80,0.2)',
    borderRadius: '6px',
    background: activeTab === tab ? 'rgba(0,255,80,0.1)' : 'transparent',
    color: activeTab === tab ? '#00ff50' : 'rgba(0,255,80,0.5)',
  })

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold"
          style={{ color: '#00ff50', fontFamily: 'monospace' }}>
          Deleted Items
        </h1>
        <p className="text-sm mt-1"
          style={{ color: 'rgba(0,255,80,0.5)' }}>
          Recover soft-deleted transactions and line items
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button style={tabStyle('transactions')}
          onClick={() => setActiveTab('transactions')}>
          TRANSACTIONS ({transactions.length})
        </button>
        <button style={tabStyle('lineitems')}
          onClick={() => setActiveTab('lineitems')}>
          LINE ITEMS ({lineItems.length})
        </button>
      </div>

      {loading ? (
        <p className="font-mono" style={{ color: 'rgba(0,255,80,0.5)' }}>Loading...</p>
      ) : (
        <>
          {/* Transactions tab */}
          {activeTab === 'transactions' && (
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
                      style={{ color: 'rgba(0,255,80,0.8)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center font-mono"
                        style={{ color: 'rgba(0,255,80,0.4)' }}>
                        No deleted transactions
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t, i) => (
                      <tr key={t.transno}
                        style={{
                          background: i % 2 === 0 ? 'rgba(0,255,80,0.02)' : 'transparent',
                          borderTop: '1px solid rgba(0,255,80,0.1)'
                        }}>
                        <td className="p-3 font-mono"
                          style={{ color: '#00ff50' }}>{t.transno}</td>
                        <td className="p-3 font-mono"
                          style={{ color: '#b0ffb0' }}>{t.salesdate}</td>
                        <td className="p-3 font-mono"
                          style={{ color: '#b0ffb0' }}>{t.custname}</td>
                        <td className="p-3 font-mono"
                          style={{ color: '#b0ffb0' }}>{t.empname}</td>
                        <td className="p-3">
                          <button
                            onClick={() => recoverTransaction(t.transno)}
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
                            RECOVER
                          </button>
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
                {transactions.length} deleted transactions
              </div>
            </div>
          )}

          {/* Line items tab */}
          {activeTab === 'lineitems' && (
            <div className="rounded-lg overflow-hidden"
              style={{ border: '1px solid rgba(0,255,80,0.2)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(0,255,80,0.1)' }}>
                    <th className="p-3 text-left font-mono"
                      style={{ color: 'rgba(0,255,80,0.8)' }}>Trans No</th>
                    <th className="p-3 text-left font-mono"
                      style={{ color: 'rgba(0,255,80,0.8)' }}>Prod Code</th>
                    <th className="p-3 text-left font-mono"
                      style={{ color: 'rgba(0,255,80,0.8)' }}>Description</th>
                    <th className="p-3 text-left font-mono"
                      style={{ color: 'rgba(0,255,80,0.8)' }}>Qty</th>
                    <th className="p-3 text-left font-mono"
                      style={{ color: 'rgba(0,255,80,0.8)' }}>Unit Price</th>
                    <th className="p-3 text-left font-mono"
                      style={{ color: 'rgba(0,255,80,0.8)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center font-mono"
                        style={{ color: 'rgba(0,255,80,0.4)' }}>
                        No deleted line items
                      </td>
                    </tr>
                  ) : (
                    lineItems.map((item, i) => (
                      <tr key={`${item.transno}-${item.prodcode}`}
                        style={{
                          background: i % 2 === 0 ? 'rgba(0,255,80,0.02)' : 'transparent',
                          borderTop: '1px solid rgba(0,255,80,0.1)'
                        }}>
                        <td className="p-3 font-mono"
                          style={{ color: '#00ff50' }}>{item.transno}</td>
                        <td className="p-3 font-mono"
                          style={{ color: '#00ff50' }}>{item.prodcode}</td>
                        <td className="p-3 font-mono"
                          style={{ color: '#b0ffb0' }}>{item.product?.description}</td>
                        <td className="p-3 font-mono"
                          style={{ color: '#b0ffb0' }}>{item.quantity}</td>
                        <td className="p-3 font-mono"
                          style={{ color: '#b0ffb0' }}>
                          {Number(item.unitprice).toLocaleString('en-PH', {
                            style: 'currency', currency: 'PHP'
                          })}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => recoverLineItem(item.transno, item.prodcode)}
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
                            RECOVER
                          </button>
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
                {lineItems.length} deleted line items
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}