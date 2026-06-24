import { createContext, useContext, type ReactNode } from 'react'

export interface LocalUser {
  uid: string
  email: string
  displayName: string
}

interface AuthContextValue {
  user: LocalUser
  loading: false
}

const LOCAL_USER: LocalUser = {
  uid: 'local-user',
  email: 'local@offline',
  displayName: 'Local User',
}

const AuthContext = createContext<AuthContextValue>({ user: LOCAL_USER, loading: false })

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext value={{ user: LOCAL_USER, loading: false }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
