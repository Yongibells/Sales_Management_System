import { supabase } from '../lib/supabaseClient'

export async function getSales(userType) {
  let query = supabase.from('sales').select('*')

  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE')
  }

  const { data, error } = await query
  return { data, error }
}

export async function createSale(saleData) {
  const { data, error } = await supabase
    .from('sales')
    .insert([{ ...saleData, record_status: 'ACTIVE' }])
    .select()

  return { data, error }
}

export async function updateSale(transno, updates) {
  const { data, error } = await supabase
    .from('sales')
    .update(updates)
    .eq('transno', transno)
    .select()

  return { data, error }
}

export async function softDeleteSale(transno) {
  const { data, error } = await supabase
    .from('sales')
    .update({ record_status: 'DELETED' })
    .eq('transno', transno)
    .select()

  return { data, error }
}

export async function recoverSale(transno) {
  const { data, error } = await supabase
    .from('sales')
    .update({ record_status: 'ACTIVE' })
    .eq('transno', transno)
    .select()

  return { data, error }
}