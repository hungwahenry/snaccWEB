"use client"

import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { ScoreLadder } from "../components/score-ladder"
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
        <div className="flex justify-center py-24">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : (
        <ScoreLadder standing={page.standing} ladder={page.ladder} />
      )}
    </>
  )
}
