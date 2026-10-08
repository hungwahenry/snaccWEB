import type { ChatTheme, WornTheme } from "../types"

export interface ThemeChoice<Photo extends { uri: string }> {
  themeId: string | null
  photo: Photo | null
}

interface PickerInput<Photo extends { uri: string }> {
  catalog: ChatTheme[]
  worn: WornTheme | null
  picked: ThemeChoice<Photo> | null
  premium: boolean
  premiumOnSale: boolean
}

export interface PickerState {
  themes: ChatTheme[]
  selectedId: string | null
  selected: ChatTheme | null
  photoUrl: string | null
  locked: boolean
  changed: boolean
}

export function pickerState<Photo extends { uri: string }>({
  catalog,
  worn,
  picked,
  premium,
  premiumOnSale,
}: PickerInput<Photo>): PickerState {
  const themes = catalog.filter(
    (theme) => !theme.premium || premium || premiumOnSale
  )
  const selectedId = picked ? picked.themeId : (worn?.id ?? null)
  const selected = themes.find((theme) => theme.id === selectedId) ?? null
  const keptPhoto = worn?.kind === "photo" ? worn.photo_url : null

  return {
    themes,
    selectedId,
    selected,
    photoUrl: picked?.photo?.uri ?? keptPhoto,
    locked: selected !== null && selected.premium && !premium,
    changed:
      picked !== null &&
      (picked.themeId !== (worn?.id ?? null) || picked.photo !== null),
  }
}

export function choiceFor<Photo extends { uri: string }>(
  theme: ChatTheme | null,
  picked: ThemeChoice<Photo> | null
): ThemeChoice<Photo> {
  return {
    themeId: theme?.id ?? null,
    photo: theme?.kind === "photo" ? (picked?.photo ?? null) : null,
  }
}
