import { api } from "@/lib/api/client"
import { appendImage, type PickedImage } from "@/lib/media"
import type { User } from "@/features/users/types"

export interface UsernameAvailability {
  username: string
  available: boolean
}

export function checkUsername(username: string): Promise<UsernameAvailability> {
  return api.get<UsernameAvailability>("/onboarding/check-username", {
    username,
  })
}

export interface CompleteProfileInput {
  username: string
  displayName: string
  universityId: string
  avatar?: PickedImage | null
  graduated?: boolean
  graduationYear?: number
}

export function completeProfile(input: CompleteProfileInput): Promise<User> {
  const form = new FormData()

  form.append("username", input.username)
  form.append("displayName", input.displayName)
  form.append("universityId", input.universityId)
  if (input.graduated) form.append("graduated", "true")
  if (input.graduationYear !== undefined)
    form.append("graduationYear", String(input.graduationYear))
  if (input.avatar) appendImage(form, "avatar", input.avatar, input.username)

  return api.upload<User>("/onboarding/complete-profile", form)
}
