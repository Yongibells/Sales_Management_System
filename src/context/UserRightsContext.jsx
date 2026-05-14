import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const UserRightsContext = createContext({})

export function UserRightsProvider({ children }) {
  const { currentUser } = useAuth()
  const [rights, setRights] = useState({})
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      setRights({})
      setUserType(null)
      setLoading(false)
      return
    }
    loadRights(currentUser.id)
  }, [currentUser])

  const loadRights = async (userId) => {
    setLoading(true)

    // Get user type
    const { data: userData } = await supabase
      .from('user')
      .select('user_type')
      .eq('userid', userId)
      .single()

    if (userData) setUserType(userData.user_type)

    // Get all rights IDs and values
    const { data: umrData } = await supabase
      .from('usermodule_rights')
      .select('rightsid, isallowed')
      .eq('userid', userId)

    if (umrData && umrData.length > 0) {
      // Get all rights names
      const { data: rightsData } = await supabase
        .from('rights')
        .select('rightsid, rightsname')

      if (rightsData) {
        const rightsMap = {}
        umrData.forEach(umr => {
          const right = rightsData.find(r => r.rightsid === umr.rightsid)
          if (right) rightsMap[right.rightsname] = umr.isallowed
        })
        setRights(rightsMap)
        console.log('Rights loaded:', rightsMap)
      }
    }

    setLoading(false)
  }

  return (
    <UserRightsContext.Provider value={{ rights, userType, loading }}>
      {children}
    </UserRightsContext.Provider>
  )
}

export function useRights() {
  return useContext(UserRightsContext)
}