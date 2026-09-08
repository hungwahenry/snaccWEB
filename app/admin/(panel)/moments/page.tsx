import type { Metadata } from "next"
import { MomentsScreen } from "@/features/admin/moments/screens/moments-screen"

export const metadata: Metadata = { title: "Moments" }

export default function Page() {
  return <MomentsScreen />
}
