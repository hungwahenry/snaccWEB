import type { Metadata } from "next"
import { CampusImportsScreen } from "@/features/admin/campus-imports/screens/campus-imports-screen"

export const metadata: Metadata = { title: "Campus imports" }

export default function Page() {
  return <CampusImportsScreen />
}
