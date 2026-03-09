//
//  useAuth.ts
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/19/26.
//


import { useState, useEffect } from "react"
import { supabase } from "@lib/supabaseClient"

export default function useAuth() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const session = supabase.auth.getSession().then(res => setUser(res.data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: "github" })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, signIn, signOut }
}
