import type { Metadata } from "next"
import { AGREE_PATH } from "@/features/legal/routes"
import { AgreeScreen } from "@/features/legal/screens/agree-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Updated terms" }

export default async function Page() {
  await requireSession(AGREE_PATH)

  return <AgreeScreen />
}
