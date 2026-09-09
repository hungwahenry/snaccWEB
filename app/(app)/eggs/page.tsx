import type { Metadata } from "next"
import { EggsScreen } from "@/features/eggs/screens/eggs-screen"

export const metadata: Metadata = { title: "Easter eggs" }

export default function Page() {
  return <EggsScreen />
}
