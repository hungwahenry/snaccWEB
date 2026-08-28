"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { ReservedUsernamesTable } from "@/features/admin/reserved-usernames/reserved-usernames-table"
import {
  useHoldUsername,
  useReleaseUsername,
  useReservedUsernames,
} from "@/features/admin/reserved-usernames/use-reserved-usernames"

export default function ReservedUsernamesPage() {
  const query = useReservedUsernames()
  const hold = useHoldUsername()
  const release = useReleaseUsername()

  return (
    <>
      <PageHeader
        title="Reserved usernames"
        description="Names nobody may take. A username is also a profile URL and the way somebody is believed, so routes and Snacc's own names are held back. This table is what is enforced."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load held names.
        </p>
      ) : (
        <ReservedUsernamesTable
          names={query.data}
          onHold={hold.mutate}
          onRelease={release.mutate}
          pending={hold.isPending || release.isPending}
        />
      )}
    </>
  )
}
