"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { PAGES_PATH } from "@/features/admin/shell/routes"
import { PageEditor } from "../components/page-editor"
import { usePageEditorScreen } from "../hooks/use-page-editor-screen"

export function PageEditorScreen({ id }: { id: string }) {
  const { query, editor } = usePageEditorScreen(id)

  return (
    <>
      <BackLink href={PAGES_PATH} label="Back to pages" />
      <QueryView query={query} what="this page">
        {(page) => (
          <PageEditor
            page={page}
            draft={editor.draft}
            text={editor.text}
            canSave={editor.ready}
            onBodyChange={editor.setBody}
            onSave={editor.save}
            onToggleStatus={editor.toggleStatus}
          />
        )}
      </QueryView>
    </>
  )
}
