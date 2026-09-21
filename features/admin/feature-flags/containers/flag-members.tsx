"use client"

import { MembersList } from "../components/members-list"
import { useFlagMembers } from "../hooks/use-flag-members"

export function FlagMembers({ flagKey }: { flagKey: string }) {
  const { members, add, remove } = useFlagMembers(flagKey)

  return <MembersList members={members} onAdd={add} onRemove={remove} />
}
