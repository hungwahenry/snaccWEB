"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { listAppIcons, updateAppIcon } from "../api"
import type { PositionUpdate, UpdateAppIconInput } from "../types"
import { appIconMessage } from "../utils/app-icons"
import { adminAppIconKeys } from "../utils/keys"

export function useAppIcons() {
  return useQuery({
    queryKey: adminAppIconKeys.list(),
    queryFn: listAppIcons,
  })
}

export function useAppIconActions() {
  const invalidates = [adminAppIconKeys.all()]

  const { run: reorder } = useAdminMutation({
    mutationFn: (updates: PositionUpdate[]) =>
      Promise.all(
        updates.map(({ id, position }) => updateAppIcon(id, { position }))
      ),
    success: "Order saved.",
    invalidates,
  })
  const { run: update } = useAdminMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAppIconInput }) =>
      updateAppIcon(id, input),
    success: (icon, { input }) => appIconMessage(icon, input),
    invalidates,
  })

  return useMemo(
    () => ({
      reorder,
      rename: (id: string, label: string) => update({ id, input: { label } }),
      setEnabled: (id: string, enabled: boolean) =>
        update({ id, input: { enabled } }),
    }),
    [reorder, update]
  )
}
