"use client"

import { useEffect, useState } from "react"
import {
  applyChoice,
  CATEGORIES,
  isActive,
  type AvatarOptions,
  type Choice,
} from "../utils/catalog"
import { useAvatarBuilder } from "../utils/dicebear"
import { useSaveAvatar } from "./use-save-avatar"

function sameOptions(a: AvatarOptions, b: AvatarOptions): boolean {
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every((key) => a[key] === b[key])
}

export function useAvatarEditor(onSaved: () => void) {
  const { build, initialOptions } = useAvatarBuilder()
  const save = useSaveAvatar()

  const [options, setOptions] = useState<AvatarOptions>(initialOptions)
  const [activeKey, setActiveKey] = useState<string>(CATEGORIES[0].key)

  const dirty = !sameOptions(options, initialOptions)

  // A browser can only be asked about closing the tab; in-app navigation is the user's own doing
  // and the Save button is right there, so nothing blocks it.
  useEffect(() => {
    if (!dirty) return

    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  const category =
    CATEGORIES.find((item) => item.key === activeKey) ?? CATEGORIES[0]

  return {
    avatarUrl: build(options),
    tabs: CATEGORIES.map((item) => ({ value: item.key, label: item.label })),
    activeKey,
    setActiveKey,
    category,
    columns: category.kind === "color" ? 6 : 4,
    dirty,
    isSelected: (choice: Choice) => isActive(options, choice),
    preview: (choice: Choice) => build(applyChoice(options, choice)),
    pick: (choice: Choice) =>
      setOptions((current) => applyChoice(current, choice)),
    reset: () => setOptions({}),
    submit: () => save.mutate(options, { onSuccess: onSaved }),
    saving: save.isPending,
  }
}
