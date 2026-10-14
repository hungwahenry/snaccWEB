"use client"

import { useCountryChoices } from "@/features/admin/countries/hooks/use-country-choices"
import { useCampuses } from "@/features/admin/universities/hooks/use-universities"
import { useAnnouncementEditor } from "./use-announcement-editor"

export function useNewAnnouncementScreen() {
  return {
    editor: useAnnouncementEditor(),
    campuses: useCampuses(),
    countries: useCountryChoices(),
  }
}
