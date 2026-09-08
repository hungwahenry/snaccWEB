import type { Metadata } from "next"
import { EditBirthdayScreen } from "@/features/account/screens/edit-birthday-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Birthday" }

export default async function Page() {
  await requireSession("/edit-birthday")

  return <EditBirthdayScreen />
}
