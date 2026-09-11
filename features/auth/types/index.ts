import type { User } from "@/features/users/types"

export interface SignInInput {
  email: string
  code: string
}

export interface SignInResult {
  user: User
  is_new_user: boolean
}

export type LoginStep = "email" | "code"
