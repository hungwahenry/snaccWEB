import type { Metadata } from "next"
import { ChangeEmailScreen } from "@/features/account/screens/change-email-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Change email" }

export default async function Page() {
  await requireSession("/settings/email")

  return <ChangeEmailScreen />
}
