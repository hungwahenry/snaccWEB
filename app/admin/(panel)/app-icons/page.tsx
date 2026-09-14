import type { Metadata } from "next"
import { AppIconsScreen } from "@/features/admin/app-icons/screens/app-icons-screen"

export const metadata: Metadata = { title: "App icons" }

export default function Page() {
  return <AppIconsScreen />
}
