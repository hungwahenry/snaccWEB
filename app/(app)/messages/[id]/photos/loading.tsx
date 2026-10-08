import { PhotoGridSkeleton } from "@/features/messages/components/details/photo-grid-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Photos" />
      <div className="p-4">
        <PhotoGridSkeleton count={15} />
      </div>
    </>
  )
}
