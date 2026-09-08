import type { Metadata } from "next"
import { HomeScreen } from "@/features/feed/screens/home-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Home" }

export default async function HomePage() {
  await requireSession("/home")
  return <HomeScreen />
}
