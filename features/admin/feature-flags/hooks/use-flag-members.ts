"use client"

import { useQuery } from "@tanstack/react-query"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { addFlagMember, listFlagMembers, removeFlagMember } from "../api"
import { adminFlagKeys } from "../utils/keys"

export function useFlagMembers(key: string) {
  const members = useQuery({
    queryKey: adminFlagKeys.members(key),
    queryFn: () => listFlagMembers(key),
  })
  const invalidates = [adminFlagKeys.members(key), adminFlagKeys.list()]

  const { run: add } = useAdminMutation({
    mutationFn: (username: string) => addFlagMember(key, username),
    success: (member) => `@${member.user.username ?? "them"} added.`,
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (userId: string) => removeFlagMember(key, userId),
    success: "Taken off the list.",
    invalidates,
  })

  return { members, add, remove }
}
