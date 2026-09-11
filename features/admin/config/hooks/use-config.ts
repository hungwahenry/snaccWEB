"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { listConfig, updateConfig } from "../api"
import type { AdminConfigSetting, ConfigDraft } from "../types"
import { groupByCategory, toUpdateInput } from "../utils/config"
import { adminConfigKeys } from "../utils/keys"

export function useConfigGroups() {
  return useQuery({
    queryKey: adminConfigKeys.list(),
    queryFn: listConfig,
    select: groupByCategory,
  })
}

export function useConfigActions() {
  const { run: save } = useAdminMutation({
    mutationFn: ({
      setting,
      draft,
    }: {
      setting: AdminConfigSetting
      draft: ConfigDraft
    }) => updateConfig(setting.key, toUpdateInput(setting, draft)),
    success: (setting) => `${setting.key} saved.`,
    invalidates: [adminConfigKeys.all()],
  })

  return useMemo(
    () => ({
      save: (setting: AdminConfigSetting, draft: ConfigDraft) =>
        save({ setting, draft }),
    }),
    [save]
  )
}
