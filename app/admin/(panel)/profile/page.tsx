import type { Metadata } from "next"
import { AdminProfileScreen } from "@/features/admin/profile/screens/profile-screen"

export const metadata: Metadata = { title: "Your access" }

export default function Page() {
  return <AdminProfileScreen />
}
