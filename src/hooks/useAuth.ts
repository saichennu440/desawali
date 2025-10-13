import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { User as AppUser } from '../types'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile helper (unchanged except small log)
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // single() returns an error code when no rows; we'll log for debug
        console.error('Error fetching profile:', error)
        return
      }

      setProfile({
        ...data,
        email: user?.email || '',
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }, [user])

  // Upsert profile helper (idempotent, safe for RLS)
  const upsertProfile = useCallback(
    async (u: User | null, opts?: { full_name?: string; phone?: string }) => {
      if (!u) return { error: 'No user provided' }

      try {
        console.log('[useAuth] upsertProfile user.id=', u.id)
        const full_name = opts?.full_name ?? (u.user_metadata as any)?.full_name ?? ''
        const phone = opts?.phone ?? (u.user_metadata as any)?.phone ?? ''

        const { data, error } = await supabase
          .from('profiles')
          .upsert(
            [
              {
                id: u.id,
                full_name,
                phone,
                is_admin: false,
              },
            ],
            { onConflict: 'id' }
          )
          .select()

        if (error) {
          console.error('[useAuth] upsertProfile error:', error)
          return { error }
        }

        console.log('[useAuth] upsertProfile success', data)
        // update local profile state
        setProfile((prev) => ({ ...(prev ?? {}), ...(data?.[0] ?? {}), email: u.email ?? '' } as AppUser))
        return { data }
      } catch (error) {
        console.error('[useAuth] upsertProfile exception', error)
        return { error }
      }
    },
    []
  )

  // Initial session + profile load
  useEffect(() => {
    let mounted = true

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        setUser(session?.user ?? null)

        if (session?.user) {
          // ensure profile exists / load it
          await fetchProfile(session.user.id)
        }

      } catch (err) {
        console.error('getInitialSession error', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    // subscribe to auth changes (handles email-confirm flows)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[useAuth] onAuthStateChange', event)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Debug: show that a token exists
        console.log('[useAuth] session.user.id =', session.user.id, 'has token?', !!session.access_token)

        // Try to fetch existing profile
        try {
          const { data: existing, error: selectError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single()

          if (selectError) {
            // If 404/no rows, single() returns error; ignore it and create profile
            console.log('[useAuth] profile select error (may be no row):', selectError.message ?? selectError)
            // Upsert will create if missing
            await upsertProfile(session.user)
          } else if (!existing) {
            // not found -> create
            await upsertProfile(session.user)
          } else {
            // found -> fetch full profile
            await fetchProfile(session.user.id)
          }
        } catch (err) {
          console.error('[useAuth] onAuthStateChange error', err)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile, upsertProfile])

  // Sign in (unchanged, but now we upsert profile on success)
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error && data?.user && data?.session) {
      // session present: ensure profile exists
      await upsertProfile(data.user)
      await fetchProfile(data.user.id)
    }

    return { data, error }
  }

  // Sign up (improved: pass metadata, handle session/no-session)
  const signUp = async (email: string, password: string, fullName?: string, phone?: string) => {
    const { data, error } = await supabase.auth.signUp(
      { email, password },
      { data: { full_name: fullName ?? '', phone: phone ?? '' } }
    )

    if (!error && data?.user && data?.session) {
      // Immediate session (no email confirmation required) -> upsert profile now
      await upsertProfile(data.user, { full_name: fullName, phone })
    } else {
      // No immediate session (email confirm flow) -> profile will be created on sign-in via onAuthStateChange
      console.log('[useAuth] signUp created user but no session; profile will be created on sign-in after confirmation.')
    }

    return { data, error }
  }

  // Sign out (unchanged)
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
    }
    return { error }
  }

  // Update profile (unchanged except keep state in sync)
  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) return { error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile({ ...profile, ...data, email: user.email || '' } as AppUser)
    }

    return { data, error }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin: profile?.is_admin || false,
  }
}
