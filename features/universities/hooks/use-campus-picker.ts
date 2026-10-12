"use client"

import { useState } from "react"
import type { University } from "../types"
import { useCampusSheet } from "./use-campus-sheet"

export function useCampusPicker() {
  const [selected, setSelected] = useState<University | null>(null)
  const campus = useCampusSheet(setSelected)

  return { selected, open: campus.show, sheet: campus.sheet }
}

export type CampusPicker = ReturnType<typeof useCampusPicker>
