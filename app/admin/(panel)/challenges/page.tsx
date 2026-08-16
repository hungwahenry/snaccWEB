"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { ChallengesTable } from "@/features/admin/challenges/challenges-table"
import { useChallengeMutations, useChallenges } from "@/features/admin/challenges/use-challenges"
import type { ListChallengesParams } from "@/features/admin/challenges/types"

export default function ChallengesPage() {
  const [params, setParams] = useState<ListChallengesParams>({ page: 1, perPage: 20 })
  const query = useChallenges(params)
  const mutations = useChallengeMutations()

  function patch(next: Partial<ListChallengesParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader
        title="Challenges"
        description="N-day posting challenges that pay users per day completed."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load challenges.</p>
      ) : (
        <ChallengesTable
          data={query.data}
          params={params}
          onParams={patch}
          mutations={mutations}
        />
      )}
    </>
  )
}
