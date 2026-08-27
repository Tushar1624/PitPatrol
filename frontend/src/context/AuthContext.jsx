import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

const AuthContext = createContext(null)

/**
 * Auth lifecycle:
 * loading → session check → authenticated | unauthenticated | error
 * onAuthStateChange keeps state in sync.
 * Auth subscription is always cleaned up on unmount.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    let cancelled = false

    /**
     * Backend 401 handler: clears local auth state so protected routes
     * redirect to /login with the session-expired notice. No retry loops.
     */
    const handleSessionExpired = () => {
      setSessionExpired(true)
      setUser(null)
      setSession(null)
      supabase.auth.signOut().catch(() => {})
    }

    window.addEventListener("smartroad:session-expired", handleSessionExpired)

    supabase.auth
      .getSession()
      .then(({ data: { session: s }, error }) => {
        if (cancelled) return
        if (error) {
          setAuthError(error.message)
        } else {
          setSession(s)
          setUser(s?.user ?? null)
        }
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setAuthError(err?.message ?? "Failed to initialize authentication.")
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN") setSessionExpired(false)
      setSession(s)
      setUser(s?.user ?? null)
      setAuthError(null)
    })

    return () => {
      cancelled = true
      window.removeEventListener("smartroad:session-expired", handleSessionExpired)
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }, [])

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    })
    return { data, error }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }, [])

  const value = useMemo(
    () => ({ user, session, loading, authError, sessionExpired, signIn, signUp, signOut }),
    [user, session, loading, authError, sessionExpired, signIn, signUp, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
