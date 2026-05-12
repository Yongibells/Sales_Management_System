import { supabase } from '../lib/supabaseClient'

export async function getCustomers() {
  const { data, error } = await supabase
    .from('customer')
    .select('*')

  return { data, error }
}

export async function getEmployees() {
  const { data, error } = await supabase
    .from('employee')
    .select('*')

  return { data, error }
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('product')
    .select('*')

  return { data, error }
}

export async function getCurrentPrice(prodCode) {
  const { data, error } = await supabase
    .from('pricehist')
    .select('*')
    .eq('prodcode', prodCode)
    .order('effdate', { ascending: false })
    .limit(1)
    .single()

  return { data, error }
}