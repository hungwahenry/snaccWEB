"use client"

import { useCallback } from "react"
import type { MoveDirection } from "../types"
import { swapWithNeighbour } from "../utils/app-icons"
import { useAppIconActions, useAppIcons } from "./use-app-icons"

export function useAppIconsScreen() {
  const query = useAppIcons()
  const actions = useAppIconActions()

  const icons = query.data
  const { reorder } = actions
  const move = useCallback(
    (id: string, direction: MoveDirection) => {
      const updates = swapWithNeighbour(icons ?? [], id, direction)

      return updates ? reorder(updates) : undefined
    },
    [icons, reorder]
  )

  return { query, actions, move }
}
