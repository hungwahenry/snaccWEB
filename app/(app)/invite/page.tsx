import type { Metadata } from "next"
import { InviteScreen } from "@/features/referrals/screens/invite-screen"
import { INVITE_PATH } from "@/features/referrals/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Invite friends" }

export default async function Page() {
  await requireSession(INVITE_PATH)

  return <InviteScreen />
}
