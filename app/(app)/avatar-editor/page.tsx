import type { Metadata } from "next"
import { AvatarEditorScreen } from "@/features/avatar/screens/avatar-editor-screen"

export const metadata: Metadata = { title: "Your avatar" }

export default function Page() {
  return <AvatarEditorScreen />
}
