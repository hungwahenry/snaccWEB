import type { Metadata } from "next"
import { SearchScreen } from "@/features/search/screens/search-screen"
import { SEARCH_PATH } from "@/features/search/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Explore" }

export default async function SearchPage() {
  await requireSession(SEARCH_PATH)
  return <SearchScreen />
}
