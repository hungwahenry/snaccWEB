"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { AnnouncementsTable } from "@/features/admin/announcements/components/announcements-table"
import {
  useAnnouncementMutations,
  useAnnouncements,
} from "@/features/admin/announcements/hooks/use-announcements"
import { useAllUniversities } from "@/features/admin/universities/hooks/use-universities"
import type { ListAnnouncementsParams } from "@/features/admin/announcements/types"

export default function AnnouncementsPage() {
  const [params, setParams] = useState<ListAnnouncementsParams>({
    page: 1,
    perPage: 20,
  })
  const query = useAnnouncements(params)
  const universities = useAllUniversities()
  const mutations = useAnnouncementMutations()

  function patch(next: Partial<ListAnnouncementsParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Broadcast a notice to every campus or one."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load announcements.
        </p>
      ) : (
        <AnnouncementsTable
          data={query.data}
          onParams={patch}
          universities={universities.data ?? []}
          mutations={mutations}
        />
      )}
    </>
  )
}
