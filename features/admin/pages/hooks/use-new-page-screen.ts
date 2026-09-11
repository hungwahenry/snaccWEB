"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { PAGES_PATH } from "@/features/admin/shell/routes"
import { usePageEditor } from "./use-page-editor"

export function useNewPageScreen() {
  const router = useRouter()
  const onCreated = useCallback(() => router.replace(PAGES_PATH), [router])

  return { editor: usePageEditor(undefined, onCreated) }
}
