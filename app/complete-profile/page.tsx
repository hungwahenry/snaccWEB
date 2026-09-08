import type { Metadata } from "next"
import { CompleteProfileScreen } from "@/features/onboarding/screens/complete-profile-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Complete your profile" }

export default async function CompleteProfilePage() {
  await requireSession("/complete-profile")
  return <CompleteProfileScreen />
}
