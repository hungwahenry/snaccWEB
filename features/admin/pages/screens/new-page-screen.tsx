"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { PAGES_PATH } from "@/features/admin/shell/routes"
import { PageEditor } from "../components/page-editor"
import { useNewPageScreen } from "../hooks/use-new-page-screen"

export function NewPageScreen() {
  const { editor } = useNewPageScreen()

  return (
    <>
      <BackLink href={PAGES_PATH} label="Back to pages" />
      <PageEditor
        draft={editor.draft}
        text={editor.text}
        canSave={editor.ready}
        onBodyChange={editor.setBody}
        onSave={editor.save}
        onToggleStatus={editor.toggleStatus}
      />
    </>
  )
}
