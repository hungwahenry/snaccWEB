import type { Metadata } from "next"
import { PagesScreen } from "@/features/admin/pages/screens/pages-screen"

export const metadata: Metadata = { title: "Pages" }

export default function Page() {
  return <PagesScreen />
}
