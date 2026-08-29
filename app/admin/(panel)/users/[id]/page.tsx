"use client"

import { use } from "react"
import { DetailScreen } from "@/components/admin/detail-screen"
import { UserDetail } from "@/features/admin/users/components/user-detail"
import {
  useUser,
  useUserMutations,
} from "@/features/admin/users/hooks/use-users"

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
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
