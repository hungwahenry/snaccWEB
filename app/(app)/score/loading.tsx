import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { ScoreLadderSkeleton } from "@/features/score/components/score-ladder-skeleton"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Snacc Score" />
      <ScoreLadderSkeleton />
    </>
  )
}
