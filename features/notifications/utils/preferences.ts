import type { NotificationPreference, PreferenceSection } from "../types"

export function sectionsOf(
  preferences: NotificationPreference[]
): PreferenceSection[] {
  const sections: PreferenceSection[] = []
  for (const preference of preferences) {
    const last = sections.at(-1)
    if (last?.key === preference.section) last.preferences.push(preference)
    else
      sections.push({
        key: preference.section,
        label: preference.section_label,
        preferences: [preference],
      })
  }
  return sections
}
