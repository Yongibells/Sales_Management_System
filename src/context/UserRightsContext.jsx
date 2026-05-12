import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const UserRightsContext = createContext(null)

export function UserRightsProvider({ children }) {
  const { currentUser, loading: authLoading } = useAuth()
  const [rights, setRights] = useState([])
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!currentUser) {
      setRights([])
      setUserType(null)
      setLoading(false)
      return
    }

    async function loadRights() {
      setLoading(true)

      const { data: userData } = await supabase
        .from('user')
        .select('user_type')
        .eq('userid', currentUser.id)
        .single()

      setUserType(userData?.user_type ?? null)

      const { data: rightsData } = await supabase
        .from('usermodule_rights')
        .select('rightsid, isallowed')
        .eq('userid', currentUser.id)

      setRights(rightsData ?? [])
      setLoading(false)
    }

    loadRights()
  }, [currentUser, authLoading])

  function hasRight(rightsid) {
    const right = rights.find((r) => r.rightsid === rightsid)
    return right?.isallowed ?? false
  }

  return (
    <UserRightsContext.Provider value={{ rights, userType, loading, hasRight }}>
      {children}
    </UserRightsContext.Provider>
  )
}

export function useUserRights() {
  return useContext(UserRightsContext)
}