import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const UserRightsContext = createContext(null)

export function UserRightsProvider({ children }) {
  const { currentUser, loading: authLoading } = useAuth()
  const [rights, setRights] = useState({})
  const [userType, setUserType] = useState(null)
  const [loadingRights, setLoadingRights] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!currentUser) {
      setRights({})
      setUserType(null)
      setLoadingRights(false)
      return
    }

    async function loadRights() {
      setLoadingRights(true)

      const { data: userData } = await supabase
        .from('user')
        .select('user_type')
        .eq('userid', currentUser.id)
        .single()
      setUserType(userData?.user_type ?? null)

      const { data: rightsData } = await supabase
        .from('usermodule_rights')
        .select('rightsid, isallowed, rights(rightsname)')
        .eq('userid', currentUser.id)

      const rightsMap = {}
      if (rightsData) {
        rightsData.forEach(row => {
          const name = row.rights?.rightsname
          if (name) rightsMap[name] = row.isallowed ? 1 : 0
        })
      }

      setRights(rightsMap)
      setLoadingRights(false)
    }

    loadRights()
  }, [currentUser, authLoading])

  return (
    <UserRightsContext.Provider value={{ rights, userType, loadingRights }}>
      {children}
    </UserRightsContext.Provider>
  )
}

export function useRights() {
  return useContext(UserRightsContext)
}

export function useUserRights() {
  return useContext(UserRightsContext)
}
