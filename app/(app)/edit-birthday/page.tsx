import type { Metadata } from "next"
import { EditBirthdayScreen } from "@/features/account/screens/edit-birthday-screen"
import { EDIT_BIRTHDAY_PATH } from "@/features/account/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Birthday" }

export default async function Page() {
  await requireSession(EDIT_BIRTHDAY_PATH)

  return <EditBirthdayScreen />
}
