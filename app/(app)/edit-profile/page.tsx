import type { Metadata } from "next"
import { EditProfileScreen } from "@/features/account/screens/edit-profile-screen"
import { EDIT_PROFILE_PATH } from "@/features/account/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Edit profile" }

export default async function EditProfilePage() {
  await requireSession(EDIT_PROFILE_PATH)
  return <EditProfileScreen />
}
