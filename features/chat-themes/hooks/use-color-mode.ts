"use client"

import { useTheme } from "next-themes"
import type { ColorMode } from "../utils/paint"

export function useColorMode(): ColorMode {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === "dark" ? "dark" : "light"
}
