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
  if (input.avatar) appendImage(form, "avatar", input.avatar, input.username)
  if (input.cover)
    appendImage(form, "cover", input.cover, `${input.username}-cover`)
  else if (input.removeCover) form.append("removeCover", "true")

  return api.uploadPatch<User>("/profile", form)
}
