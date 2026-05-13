import { supabase } from '../lib/supabaseClient'

export async function getDetailByTrans(transNo, userType) {
  let query = supabase
    .from('salesdetail')
    .select('*')
    .eq('transno', transNo)

  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE')
  }

  const { data, error } = await query
  return { data, error }
}

export async function addDetailLine(detailData) {
  const { data, error } = await supabase
    .from('salesdetail')
    .insert([{ ...detailData, record_status: 'ACTIVE' }])
    .select()

  return { data, error }
}

export async function updateDetailLine(transNo, prodCode, updates) {
  const { data, error } = await supabase
    .from('salesdetail')
    .update(updates)
    .eq('transno', transNo)
    .eq('prodcode', prodCode)
    .select()

  return { data, error }
}

export async function softDeleteDetailLine(transNo, prodCode) {
  const { data, error } = await supabase
    .from('salesdetail')
    .update({ record_status: 'DELETED' })
    .eq('transno', transNo)
    .eq('prodcode', prodCode)
    .select()

  return { data, error }
}

export async function recoverDetailLine(transNo, prodCode) {
  const { data, error } = await supabase
    .from('salesdetail')
    .update({ record_status: 'ACTIVE' })
    .eq('transno', transNo)
    .eq('prodcode', prodCode)
    .select()

  return { data, error }
}