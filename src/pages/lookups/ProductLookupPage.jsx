import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ErrorBoundary from '../../components/ErrorBoundary'
import LoadingSpinner from '../../components/LoadingSpinner'

function ProductLookupContent() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from('product').select('*')
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
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
      <button
        onClick={fetchProducts}
        style={{
          marginTop: '16px',
          background: 'transparent',
          border: '1px solid rgba(255,80,80,0.4)',
          color: 'rgba(255,80,80,0.8)'

