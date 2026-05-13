import { supabase } from '../lib/supabaseClient'

export async function getSalesByEmployee() {
  const { data, error } = await supabase
    .from('sales_by_employee')
    .select('*')

  return { data, error }
}

export async function getSalesByCustomer() {
  const { data, error } = await supabase
    .from('sales_by_customer')
    .select('*')

  return { data, error }
}

export async function getTopProducts() {
  const { data, error } = await supabase
    .from('top_products_sold')
    .select('*')

  return { data, error }
}

export async function getMonthlySalesTrend() {
  const { data, error } = await supabase
    .from('monthly_sales_trend')
    .select('*')

  return { data, error }
}