import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInitialSession = async () => {
      setLoading(true)
      try {
        console.log('Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
        }

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            await fetchProfile(session.user.id)
          } catch (err) {
            console.error('Profile fetch failed:', err)
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            await fetchProfile(session.user.id)
          } catch (err) {
            console.error('Profile fetch failed:', err)
          }
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for user:', userId)
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError)
      return
    }

    if (existingProfile) {
      console.log('Profile found:', existingProfile.full_name)
      setProfile(existingProfile)
    } else {
      console.log('No profile found, creating one...')
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: user?.user_metadata?.full_name || null,
          phone: user?.user_metadata?.phone || null,
          is_admin: false,
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating profile:', createError)
      } else {
        console.log('Profile created:', newProfile?.full_name)
        setProfile(newProfile)
      }
    }
  }

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      console.log('Signing up user:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null,
          },
        },
      })

      if (error) {
        console.error('Sign up error:', error)
        return { error }
      }

      console.log('Sign up successful:', data.user?.email)
      return { error: null }
    } catch (error) {
      console.error('Sign up exception:', error)
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }

      console.log('Sign in successful:', data.user?.email)
      return { error: null }
    } catch (error) {
      console.error('Sign in exception:', error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      } else {
        console.log('Sign out successful')
        setUser(null)
        setProfile(null)
        setSession(null)
      }
    } catch (error) {
      console.error('Sign out exception:', error)
    }
  }

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) {
        return { error: new Error('No user logged in') }
      }

      console.log('Updating profile:', data)
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return { error: new Error(error.message) }
      }

      console.log('Profile updated successfully')
      setProfile(updatedProfile)
      return { error: null }
    } catch (error) {
      console.error('Update profile exception:', error)
      return { error: error as Error }
    }
  }

  const isAdmin = profile?.is_admin || false

  return {
    user,
    profile,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }
}

// Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider()
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
