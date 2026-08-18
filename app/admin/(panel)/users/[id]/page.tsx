"use client"

import Link from "next/link"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { UserRoles } from "@/features/admin/roles/user-roles"
import { UserDetail } from "@/features/admin/users/user-detail"
import { useUser, useUserMutations } from "@/features/admin/users/use-users"

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const query = useUser(id)
  const actions = useUserMutations(id)

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-4 w-fit" render={<Link href="/admin/users" />}>
        ← Back to users
      </Button>
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load this user.</p>
      ) : (
        <div className="flex flex-col gap-6">
          <UserDetail user={query.data} actions={actions} />
          <UserRoles userId={id} />
        </div>
      )}
    </>
  )
}
