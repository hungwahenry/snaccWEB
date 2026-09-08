"use client"

import { DetailScreen } from "@/features/admin/shell/ui/detail-screen"
import { UserDetail } from "@/features/admin/users/components/user-detail"
import {
  useUser,
  useUserMutations,
} from "@/features/admin/users/hooks/use-users"

export function UserDetailScreen({ id }: { id: string }) {
  const query = useUser(id)
  const actions = useUserMutations(id)

  return (
    <DetailScreen
      backHref="/admin/users"
      backLabel="Back to users"
      missing="Couldn't load this user."
      query={query}
    >
      {(user) => <UserDetail user={user} actions={actions} />}
    </DetailScreen>
  )
}
