import type { Metadata } from "next"
import { EggsScreen } from "@/features/admin/eggs/screens/eggs-screen"

export const metadata: Metadata = { title: "Easter eggs" }

export default function Page() {
  return <EggsScreen />
}
