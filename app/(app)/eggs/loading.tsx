import { EggsSkeleton } from "@/features/eggs/components/eggs-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Easter eggs" />
      <EggsSkeleton />
    </>
  )
}
