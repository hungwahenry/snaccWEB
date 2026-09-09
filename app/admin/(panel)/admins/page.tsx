import type { Metadata } from "next"
import { AdminsScreen } from "@/features/admin/admins/screens/admins-screen"

export const metadata: Metadata = { title: "Admins" }

export default function Page() {
  return <AdminsScreen />
}
