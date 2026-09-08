import type { Metadata } from "next"
import { SuspensionsScreen } from "@/features/admin/users/screens/suspensions-screen"

export const metadata: Metadata = { title: "Suspensions" }

export default function Page() {
  return <SuspensionsScreen />
}
