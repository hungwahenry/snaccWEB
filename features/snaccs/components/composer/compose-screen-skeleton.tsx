import { ComposerBar } from "@/components/ui/composer-bar"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { ComposerFrameSkeleton } from "./composer-frame-skeleton"
import { ComposerHeader } from "./composer-header"
import { ComposerToolbarSkeleton } from "./composer-toolbar-skeleton"

export function ComposeScreenSkeleton({
  title,
  onClose,
}: {
  title: string
  onClose: () => void
}) {
  return (
    <ComposerScreen className="overflow-y-auto">
      <ComposerHeader title={title} onClose={onClose} />
      <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
        <ComposerFrameSkeleton />
      </div>
      <ComposerBar>
        <ComposerToolbarSkeleton />
      </ComposerBar>
    </ComposerScreen>
  )
}
