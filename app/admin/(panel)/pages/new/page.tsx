import type { Metadata } from "next"
import { NewPageScreen } from "@/features/admin/pages/screens/new-page-screen"

export const metadata: Metadata = { title: "New page" }

export default function Page() {
  return <NewPageScreen />
}
