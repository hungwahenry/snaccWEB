import type { Metadata } from "next"
import { EditUniversityScreen } from "@/features/account/screens/edit-university-screen"
import { EDIT_UNIVERSITY_PATH } from "@/features/account/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Campus" }

export default async function Page() {
  await requireSession(EDIT_UNIVERSITY_PATH)

  return <EditUniversityScreen />
}
