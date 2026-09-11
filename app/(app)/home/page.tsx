import type { Metadata } from "next"
import { HomeScreen } from "@/features/feed/screens/home-screen"
import { HOME_PATH } from "@/features/feed/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Home" }

export default async function HomePage() {
  await requireSession(HOME_PATH)
  return <HomeScreen />
}
