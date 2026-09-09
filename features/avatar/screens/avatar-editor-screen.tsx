"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { AvatarEditor } from "../components/avatar-editor"

export function AvatarEditorScreen() {
  const back = useBack()

  return (
    <>
      <BackHeader title="Your avatar" onBack={back} />
      <AvatarEditor />
    </>
  )
}
