"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { UniversitiesTable } from "@/features/admin/universities/universities-table"
import { useUniversities, useUniversityMutations } from "@/features/admin/universities/use-universities"

export default function UniversitiesPage() {
  const query = useUniversities()
  const mutations = useUniversityMutations()

  return (
    <>
      <PageHeader title="Universities" description="Manage campuses and their paid-mode funds." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load universities.</p>
      ) : (
        <UniversitiesTable universities={query.data} mutations={mutations} />
      )}
    </>
  )
}
