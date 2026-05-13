import { supabase } from '../lib/supabaseClient'

export async function getUsers() {
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .neq('user_type', 'SUPERADMIN')

  return { data, error }
}

export async function activateUser(userId) {
  const { data, error } = await supabase
    .from('user')
    .update({ record_status: 'ACTIVE' })
    .eq('userid', userId)
    .neq('user_type', 'SUPERADMIN')
    .select()

  return { data, error }
}

export async function deactivateUser(userId) {
  const { data, error } = await supabase
    .from('user')
    .update({ record_status: 'INACTIVE' })
    .eq('userid', userId)
    .neq('user_type', 'SUPERADMIN')
    .select()

  return { data, error }
}