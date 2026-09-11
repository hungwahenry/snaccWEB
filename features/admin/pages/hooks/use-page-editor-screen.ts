"use client"

import { usePageEditor } from "./use-page-editor"
import { usePage } from "./use-pages"

export function usePageEditorScreen(id: string) {
  const query = usePage(id)

  return { query, editor: usePageEditor(query.data) }
}
