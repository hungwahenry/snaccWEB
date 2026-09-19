import type { Metadata } from "next"
import { AvatarEditorScreen } from "@/features/avatar/screens/avatar-editor-screen"
import { AVATAR_EDITOR_PATH } from "@/features/avatar/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Your avatar" }

export default async function Page() {
  await requireSession(AVATAR_EDITOR_PATH)
  return <AvatarEditorScreen />
}
