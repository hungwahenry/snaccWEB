import type { Metadata } from "next"
import { UniversitiesScreen } from "@/features/admin/universities/screens/universities-screen"

export const metadata: Metadata = { title: "Universities" }

export default function Page() {
  return <UniversitiesScreen />
}
