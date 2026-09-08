import type { Metadata } from "next"
import { RolesScreen } from "@/features/admin/roles/screens/roles-screen"

export const metadata: Metadata = { title: "Roles" }

export default function Page() {
  return <RolesScreen />
}
