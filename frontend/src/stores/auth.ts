import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apolloClient } from "@/lib/graphql/apollo"
import type { User, SignUpInput, SignInInput } from '@/types'
import { SIGN_UP } from '@/lib/graphql/mutations/SignUp'
import { SIGN_IN } from '@/lib/graphql/mutations/SignIn'

type SignUpMutationData = {
  signUp: {
    token: string
    user: User
  }
}

type SignInMutationData = {
  signIn: {
    token: string
    user: User
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  signUp: (data: SignUpInput) => Promise<boolean>
  signIn: (data: SignInInput) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      signIn: async (signInData: SignInInput) => {
        try {
          const { data } = await apolloClient.mutate<SignInMutationData, SignInInput>({
            mutation: SIGN_IN,
            variables: {
              email: signInData.email,
              password: signInData.password
            }
          })

          if (data?.signIn) {
            const { user, token } = data.signIn
            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
              },
              token,
              isAuthenticated: true
            })
            return true
          }
          return false
        } catch (error) {
          console.log("Erro ao fazer o sign in")
          throw error
        }
      },
      signUp: async (signUpData: SignUpInput) => {
        try {
          const { data } = await apolloClient.mutate<
            SignUpMutationData,
            { data: SignUpInput }
          >({
            mutation: SIGN_UP,
            variables: {
              data: {
                name: signUpData.name,
                email: signUpData.email,
                password: signUpData.password
              }
            }
          })
          if (data?.signUp) {
            const { token, user } = data.signUp
            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
              },
              token,
              isAuthenticated: true
            })
            return true
          }
          return false
        } catch (error) {
          console.log("Erro ao fazer o cadastro")
          throw error
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
        apolloClient.clearStore()
      },
    }),
    {
      name: 'auth-storage'
    }
  )
)
