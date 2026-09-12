import { EyeIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { EmptyState } from "@/components/ui/empty-state"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { UserRow } from "@/features/users/components/user-row"
import { timeAgo } from "@/lib/format"
import type { MomentViewer } from "../types"
import { ViewerRowSkeleton } from "./viewer-row-skeleton"

export function MomentViewersSheet({
  open,
  onOpenChange,
  viewers,
  loading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  viewers: MomentViewer[]
  loading: boolean
}) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={viewers.length === 1 ? "1 view" : `${viewers.length} views`}
      tall
      className="px-4"
    >
      {loading && viewers.length === 0 ? (
        <SkeletonRows count={8} item={ViewerRowSkeleton} />
      ) : viewers.length === 0 ? (
        <EmptyState
          icon={EyeIcon}
          title="Nobody has seen this yet"
          description="People who watch this moment turn up here."
          className="py-12"
        />
      ) : (
        viewers.map((viewer) => (
          <UserRow
            key={viewer.id}
            user={viewer}
            trailing={
              <span className="flex items-center gap-2">
                {viewer.reaction ? (
                  <span className="text-base">{viewer.reaction}</span>
                ) : null}
                <span className="text-xs text-muted-foreground">
                  {timeAgo(viewer.viewed_at)}
                </span>
              </span>
            }
          />
        ))
      )}
    </ActionSheet>
  )
}
