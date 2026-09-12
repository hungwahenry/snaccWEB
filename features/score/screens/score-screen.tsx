"use client"

import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { ScoreLadder } from "../components/score-ladder"
import { ScoreLadderSkeleton } from "../components/score-ladder-skeleton"
import { useScoreLadder } from "../hooks/use-score-ladder"

export function ScoreScreen() {
  const back = useBack()
  const page = useScoreLadder()

  return (
    <>
      <BackHeader title="Snacc Score" onBack={back} />

      {page.error ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load your score"
            onRetry={page.refetch}
          />
        </div>
      ) : page.loading || !page.standing ? (
        <ScoreLadderSkeleton />
      ) : (
        <ScoreLadder standing={page.standing} ladder={page.ladder} />
      )}
    </>
  )
}
