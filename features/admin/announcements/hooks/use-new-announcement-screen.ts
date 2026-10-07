"use client"

import { useCampuses } from "@/features/admin/universities/hooks/use-universities"
import { useAnnouncementEditor } from "./use-announcement-editor"

export function useNewAnnouncementScreen() {
  return { editor: useAnnouncementEditor(), campuses: useCampuses() }
}
