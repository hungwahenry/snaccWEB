"use client"

import Link from "next/link"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { UserDetail } from "@/features/users/user-detail"
import { useUser, useUserMutations } from "@/features/users/use-users"

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
        <UserDetail user={query.data} actions={actions} />
      )}
    </>
  )
}
