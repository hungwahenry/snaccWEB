"use client"

import { useRouter } from "next/navigation"
import { parseAsStringLiteral, useQueryState } from "nuqs"
import { useCallback, useMemo } from "react"
import { useRoles } from "@/features/admin/roles/hooks/use-roles"
import {
  useRoleGrantActions,
  useUserRoles,
} from "@/features/admin/roles/hooks/use-user-roles"
import { grantableRoles } from "@/features/admin/roles/utils/roles"
import { USERS_PATH } from "@/features/admin/shell/routes"
import { useSuspensionChoices } from "@/features/admin/suspension-reasons/hooks/use-suspension-reasons"
import { useCampuses } from "@/features/admin/universities/hooks/use-universities"
import { USER_TABS } from "../utils/users"
import { useUser, useUserActions } from "./use-users"

const TAB = parseAsStringLiteral(USER_TABS).withDefault("overview")

export function useUserDetailScreen(id: string) {
  const router = useRouter()
  const query = useUser(id)
  const [tab, setTab] = useQueryState(
    "tab",
    TAB.withOptions({ history: "replace" })
  )

  const onDeleted = useCallback(() => router.replace(USERS_PATH), [router])
  const actions = useUserActions(id, onDeleted)

  const grants = useUserRoles(id)
  const roles = useRoles()
  const grantActions = useRoleGrantActions(id)
  const grantable = useMemo(
    () => grantableRoles(roles.data ?? [], grants.data ?? []),
    [roles.data, grants.data]
  )

  return {
    query,
    tab,
    setTab,
    actions,
    campuses: useCampuses().options,
    suspension: useSuspensionChoices(),
    roles: {
      grants,
      grantable,
      grant: grantActions.grant,
      revoke: grantActions.revoke,
    },
  }
}
