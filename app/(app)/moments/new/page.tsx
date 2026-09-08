import type { Metadata } from "next"
import { MomentComposeScreen } from "@/features/moments/screens/moment-compose-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "New moment" }

export default async function NewMomentPage() {
  await requireSession("/moments/new")

  return <MomentComposeScreen />
}
