import type { Metadata } from "next"
import { MomentComposeScreen } from "@/features/moments/screens/moment-compose-screen"
import { NEW_MOMENT_PATH } from "@/features/moments/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "New moment" }

export default async function NewMomentPage() {
  await requireSession(NEW_MOMENT_PATH)

  return <MomentComposeScreen />
}
