import type { Metadata } from "next"
import { SavedScreen } from "@/features/bookmarks/screens/saved-screen"
import { SAVED_PATH } from "@/features/bookmarks/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Saved" }

export default async function SavedPage() {
  await requireSession(SAVED_PATH)
  return <SavedScreen />
}
