// // src/context/AuthContext.tsx (replace your current file with this)
// import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
// import { supabase } from '../lib/supabase'
// import type { User as SupaUser } from '@supabase/supabase-js'
// import type { User as AppUser } from '../types'

// type AuthContextType = {
//   user: SupaUser | null
//   profile: AppUser | null
//   loading: boolean
//   initialized: boolean
//   isAdmin: boolean
//   signIn: (email: string, password: string) => Promise<any>
//   signUp: (email: string, password: string, fullName?: string, phone?: string) => Promise<any>
//   signOut: () => Promise<any>
//   updateProfile: (updates: Partial<AppUser>) => Promise<any>
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const useAuth = (): AuthContextType => {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
//   return ctx
// }

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<SupaUser | null>(null)
//   const [profile, setProfile] = useState<AppUser | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [initialized, setInitialized] = useState(false)

//   // ref to avoid duplicate fetches for same user id
//   const lastFetchedUserIdRef = useRef<string | null>(null)
//   // optional: ref to prevent concurrent fetches
//   const fetchingRef = useRef(false)

//   // stable fetchProfile: no deps change so identity is stable
//   const fetchProfile = useCallback(async (userId: string) => {
//     if (!userId) return
//     // guard: avoid duplicate fetches for same user id
//     if (lastFetchedUserIdRef.current === userId && fetchingRef.current === false) {
//       // already fetched for this user id and not currently fetching — skip
//       // console.log('[AuthProvider] fetchProfile: already fetched for', userId)
//       return
//     }

//     fetchingRef.current = true
//     try {
//       console.log('[AuthProvider] fetchProfile for', userId)

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', userId)
//         .single()

//       if (error) {
//         console.log('[AuthProvider] fetchProfile - no profile or error:', error.message ?? error)
//         setProfile(null)
//         lastFetchedUserIdRef.current = userId // still mark as fetched to avoid tight-loop
//         return
//       }

//       // get the current user email directly to avoid closure on outer `user`
//       const { data: userResp } = await supabase.auth.getUser()
//       const email = (userResp?.user?.email) ?? ''

//       setProfile({ ...data, email } as AppUser)
//       lastFetchedUserIdRef.current = userId
//     } catch (err) {
//       console.error('[AuthProvider] fetchProfile exception', err)
//     } finally {
//       fetchingRef.current = false
//     }
//   }, [])

//   // upsert/insert profile helper (non-destructive). stable identity
//   const upsertProfile = useCallback(async (u: SupaUser | null, opts?: { full_name?: string; phone?: string }) => {
//     if (!u) return { error: 'No user' }
//     try {
//       const { data: existing, error: selectErr } = await supabase
//         .from('profiles')
//         .select('id, full_name, phone, is_admin')
//         .eq('id', u.id)
//         .maybeSingle()

//       // build payload only with provided fields
//       const payload: any = { id: u.id }
//       if (opts?.full_name !== undefined) payload.full_name = opts.full_name
//       if (opts?.phone !== undefined) payload.phone = opts.phone

//       if (existing && existing.id) {
//         if (Object.keys(payload).length > 1) {
//           const { data, error } = await supabase.from('profiles').update(payload).eq('id', u.id).select().single()
//           if (error) return { error }
//           setProfile((prev) => ({ ...(prev ?? {}), ...(data ?? {}), email: u.email ?? '' } as AppUser))
//           return { data }
//         }
//         return { data: existing }
//       } else {
//         const full_name = opts?.full_name ?? (u.user_metadata as any)?.full_name ?? ''
//         const phone = opts?.phone ?? (u.user_metadata as any)?.phone ?? ''
//         const insertPayload = { id: u.id, full_name, phone, is_admin: false }
//         const { data, error } = await supabase.from('profiles').insert([insertPayload]).select()
//         if (error) return { error }
//         setProfile({ ...(data?.[0] ?? {}), email: u.email ?? '' } as AppUser)
//         return { data }
//       }
//     } catch (err) {
//       console.error('[AuthProvider] upsertProfile exception', err)
//       return { error: err }
//     }
//   }, [])

//   // init once
//   useEffect(() => {
//     let mounted = true

//     const init = async () => {
//       setLoading(true)
//       try {
//         const { data: { session } } = await supabase.auth.getSession()
//         if (!mounted) return
//         const currentUser = session?.user ?? null
//         setUser(currentUser)
//         if (currentUser) {
//           await fetchProfile(currentUser.id)
//         } else {
//           setProfile(null)
//         }
//       } catch (err) {
//         console.error('[AuthProvider] init error', err)
//         setUser(null)
//         setProfile(null)
//       } finally {
//         if (mounted) {
//           setLoading(false)
//           setInitialized(true)
//         }
//       }
//     }

//     init()

//     // subscribe to auth state change; this subscription is created once by the provider
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log('[AuthProvider] auth state changed', event)
//       const newUser = session?.user ?? null
//       setUser(newUser)
//       if (newUser) {
//         // only fetch if user id changed or not fetched yet
//         if (lastFetchedUserIdRef.current !== newUser.id) {
//           await fetchProfile(newUser.id)
//         } else {
//           // profile already fetched for this id; ensure profile state is set
//           // (no double fetch)
//           // console.log('[AuthProvider] profile already fetched, skipping fetchProfile')
//         }
//       } else {
//         setProfile(null)
//         lastFetchedUserIdRef.current = null
//       }

//       setLoading(false)
//       setInitialized(true)
//     })

//     return () => {
//       mounted = false
//       try { subscription?.unsubscribe() } catch (e) { /* ignore */ }
//     }
//   }, [fetchProfile, upsertProfile])

//   const signIn = useCallback(async (email: string, password: string) => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({ email, password })
//       if (!error && data?.user && data?.session) {
//         lastFetchedUserIdRef.current = null // force refetch after sign in
//         await upsertProfile(data.user)
//         await fetchProfile(data.user.id)
//       }
//       return { data, error }
//     } catch (err) {
//       console.error('[AuthProvider] signIn exception', err)
//       return { data: null, error: err }
//     }
//   }, [fetchProfile, upsertProfile])

//   const signUp = useCallback(async (email: string, password: string, fullName?: string, phone?: string) => {
//     try {
//       const { data, error } = await supabase.auth.signUp(
//         { email, password },
//         { data: { full_name: fullName ?? '', phone: phone ?? '' } }
//       )
//       if (!error && data?.user && data?.session) {
//         lastFetchedUserIdRef.current = null
//         await upsertProfile(data.user, { full_name: fullName, phone })
//       } else {
//         console.log('[AuthProvider] signUp: user created but no session yet')
//       }
//       return { data, error }
//     } catch (err) {
//       console.error('[AuthProvider] signUp exception', err)
//       return { data: null, error: err }
//     }
//   }, [upsertProfile])

//   const signOut = useCallback(async () => {
//     try {
//       const { error } = await supabase.auth.signOut()
//       if (!error) {
//         setUser(null)
//         setProfile(null)
//         lastFetchedUserIdRef.current = null
//       }
//       return { error }
//     } catch (err) {
//       console.error('[AuthProvider] signOut exception', err)
//       return { error: err }
//     }
//   }, [])

//   const updateProfile = useCallback(
//     async (updates: Partial<AppUser>) => {
//       if (!user) return { error: new Error('No user logged in') }
//       try {
//         const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single()
//         if (!error && data) setProfile({ ...profile, ...data, email: user.email ?? '' } as AppUser)
//         return { data, error }
//       } catch (err) {
//         console.error('[AuthProvider] updateProfile exception', err)
//         return { data: null, error: err }
//       }
//     },
//     [profile, user]
//   )

//   const value: AuthContextType = {
//     user,
//     profile,
//     loading,
//     initialized,
//     isAdmin: profile?.is_admin || false,
//     signIn,
//     signUp,
//     signOut,
//     updateProfile,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }
