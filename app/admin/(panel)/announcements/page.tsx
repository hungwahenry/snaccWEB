"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { AnnouncementsTable } from "@/features/admin/announcements/announcements-table"
import {
  useAnnouncementMutations,
  useAnnouncements,
} from "@/features/admin/announcements/use-announcements"
import { useUniversities } from "@/features/admin/universities/use-universities"
import type { ListAnnouncementsParams } from "@/features/admin/announcements/types"

export default function AnnouncementsPage() {
  const [params, setParams] = useState<ListAnnouncementsParams>({ page: 1, perPage: 20 })
  const query = useAnnouncements(params)
  const universities = useUniversities()
  const mutations = useAnnouncementMutations()

  function patch(next: Partial<ListAnnouncementsParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader title="Announcements" description="Broadcast a notice to every campus or one." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load announcements.</p>
      ) : (
        <AnnouncementsTable
          data={query.data}
          params={params}
          onParams={patch}
          universities={universities.data ?? []}
          mutations={mutations}
        />
      )}
    </>
  )
}
