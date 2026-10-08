"use client"

import { ImageOffIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { PhotoGridSkeleton } from "../components/details/photo-grid-skeleton"
import { PhotoStrip } from "../components/details/photo-strip"
import { useConversationPhotoViewer } from "../hooks/use-conversation-photo-viewer"
import { conversationDetailsPath } from "../routes"

const PLACEHOLDERS = 15

export function ConversationPhotosScreen({ id }: { id: string }) {
  const back = useBack(conversationDetailsPath(id))
  const { photos, onOpen } = useConversationPhotoViewer(id)

  return (
    <>
      <BackHeader title="Photos" onBack={back} />

      {photos.loading ? (
        <div className="p-4">
          <PhotoGridSkeleton count={PLACEHOLDERS} />
        </div>
      ) : photos.failed && photos.items.length === 0 ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load these photos"
            onRetry={photos.retry}
          />
        </div>
      ) : photos.items.length === 0 ? (
        <EmptyState
          icon={ImageOffIcon}
          title="No photos yet"
          description="Photos you send each other show up here."
          className="py-24"
        />
      ) : (
        <div className="p-4">
          <PhotoStrip photos={photos.items} onOpen={onOpen} />
          <LoadMore
            onReach={photos.loadMore}
            disabled={photos.loadingMore || !photos.hasMore}
          />
          <ListFooter loading={photos.loadingMore} />
        </div>
      )}
    </>
  )
}
