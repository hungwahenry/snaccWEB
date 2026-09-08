import type { Metadata } from "next"
import { ReservedUsernamesScreen } from "@/features/admin/reserved-usernames/screens/reserved-usernames-screen"

export const metadata: Metadata = { title: "Reserved usernames" }

export default function Page() {
  return <ReservedUsernamesScreen />
}
