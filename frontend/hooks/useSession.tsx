import { useEffect, useState } from 'react'

const getUserKeyFromLocalStorage = (key: string) => {
  const userKey = localStorage.getItem(key)
  if (!userKey) {
    return null
  }
  return JSON.parse(userKey)
}

export default function useSession() {
  const [user, setUser] = useState<any | null>(null)
  const [wallet, setWallet] = useState<string | null>(null)

  useEffect(() => {
    const key = getUserKeyFromLocalStorage('user')

    if (key) {
      setUser(key.user)
      setWallet(key.wallet)
    }
  }, [])

  return { user, wallet }
}
