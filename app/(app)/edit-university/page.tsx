import type { Metadata } from "next"
import { EditUniversityScreen } from "@/features/account/screens/edit-university-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Campus" }

export default async function Page() {
  await requireSession("/edit-university")

  return <EditUniversityScreen />
}
