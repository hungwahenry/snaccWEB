import type { Metadata } from "next"
import { PromptsScreen } from "@/features/admin/onboarding-prompts/screens/prompts-screen"

export const metadata: Metadata = { title: "Onboarding prompts" }

export default function Page() {
  return <PromptsScreen />
}
