import { api } from "@/lib/api/client"
import { appendImage, type PickedImage } from "@/lib/media"
import type { Gender, User } from "@/features/users/types"

export interface UpdateProfileInput {
  username: string
  displayName: string
  bio?: string
  major?: string
  graduated: boolean
  graduationYear?: number
  gender?: Gender
  avatar?: PickedImage | null
  cover?: PickedImage | null
  /** Only sent when taking one down. Silence leaves whatever is there alone. */
  removeCover?: boolean
  birthDay?: number
  birthMonth?: number
  celebrateBirthday?: boolean
}

export function updateProfile(input: UpdateProfileInput): Promise<User> {
  const form = new FormData()

  form.append("username", input.username)
  form.append("displayName", input.displayName)
  // Always sent so an emptied field clears server-side; typed fields are omitted when unset.
  form.append("bio", input.bio ?? "")
  form.append("major", input.major ?? "")
  if (input.gender) form.append("gender", input.gender)
  form.append("graduated", input.graduated ? "true" : "false")
  if (input.graduationYear !== undefined)
    form.append("graduationYear", String(input.graduationYear))
  if (input.birthDay !== undefined)
    form.append("birthDay", String(input.birthDay))
  if (input.birthMonth !== undefined)
    form.append("birthMonth", String(input.birthMonth))
  if (input.celebrateBirthday !== undefined)
    form.append("celebrateBirthday", input.celebrateBirthday ? "true" : "false")
  if (input.avatar) appendImage(form, "avatar", input.avatar, input.username)
  if (input.cover)
    appendImage(form, "cover", input.cover, `${input.username}-cover`)
  else if (input.removeCover) form.append("removeCover", "true")

  return api.uploadPatch<User>("/profile", form)
}

export const changeEmail = (stepUpId: string) =>
  api.post<void>("/account/email", { stepUpId })

export const deleteAccount = (stepUpId: string) =>
  api.del<void>("/account", { stepUpId })

export const exportAccount = () =>
  api.get<Record<string, unknown>>("/account/export")

export const changeUniversity = (universityId: string) =>
  api.patch<User>("/profile/university", { universityId })
