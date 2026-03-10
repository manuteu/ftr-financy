import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apolloClient } from "@/lib/graphql/apollo"
import type { User, SignUpInput, SignInInput } from '@/types'
import { SIGN_UP } from '@/lib/graphql/mutations/SignUp'
import { SIGN_IN } from '@/lib/graphql/mutations/SignIn'
import { UPDATE_PROFILE } from '@/lib/graphql/mutations/UpdateProfile'
import storage from "@/storage"

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

type UpdateProfileMutationData = {
  updateProfile: User
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  signUp: (data: SignUpInput) => Promise<boolean>
  signIn: (data: SignInInput) => Promise<boolean>
  updateProfile: (name: string) => Promise<boolean>
  logout: () => void;
  getInitials: (name: string) => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      getInitials: (name: string) => {
        return name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
      },
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
          console.log("Erro ao fazer o sign in", error)
          throw error
        }
      },
      signUp: async (signUpData: SignUpInput) => {
        try {
          const { data } = await apolloClient.mutate<
            SignUpMutationData,
            { name: string, email: string, password: string }
          >({
            mutation: SIGN_UP,
            variables: {
              name: signUpData.name,
              email: signUpData.email,
              password: signUpData.password
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
      updateProfile: async (name: string) => {
        try {
          const { data } = await apolloClient.mutate<
            UpdateProfileMutationData,
            { name: string }
          >({
            mutation: UPDATE_PROFILE,
            variables: { name },
          })

          if (data?.updateProfile) {
            set({ user: data.updateProfile })
            return true
          }
          return false
        } catch (error) {
          console.log("Erro ao atualizar perfil")
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
      name: storage.AUTH_TOKEN
    }
  )
)
