"use client"

import { useAnnouncementsScreen } from "@/features/admin/announcements/hooks/use-announcements-screen"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { AnnouncementsTable } from "@/features/admin/announcements/components/announcements-table"
import { useAnnouncementMutations } from "@/features/admin/announcements/hooks/use-announcements"
import { useAllUniversities } from "@/features/admin/universities/hooks/use-universities"

export function AnnouncementsScreen() {
  const { patch, query } = useAnnouncementsScreen()
  const universities = useAllUniversities()
  const mutations = useAnnouncementMutations()

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
