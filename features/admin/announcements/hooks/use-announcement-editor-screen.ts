"use client"

import { useCountryChoices } from "@/features/admin/countries/hooks/use-country-choices"
import { useCampuses } from "@/features/admin/universities/hooks/use-universities"
import { useAnnouncementEditor } from "./use-announcement-editor"
import { useAnnouncement } from "./use-announcements"

export function useAnnouncementEditorScreen(id: string) {
  const query = useAnnouncement(id)

  return {
    query,
    editor: useAnnouncementEditor(query.data),
    campuses: useCampuses(),
    countries: useCountryChoices(),
  }
}
