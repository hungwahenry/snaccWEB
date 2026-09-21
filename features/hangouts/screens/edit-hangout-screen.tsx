"use client"

import { CalendarXIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ComposerBar } from "@/components/ui/composer-bar"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { ComposerHeader } from "@/features/snaccs/components/composer/composer-header"
import { useSnacc } from "@/features/snaccs/hooks/use-snacc"
import { snaccPath } from "@/features/snaccs/routes"
import { useBack } from "@/hooks/use-back"
import { isNotFound } from "@/lib/api/errors"
import { HangoutBlockSkeleton } from "../components/block/hangout-block-skeleton"
import { HangoutEditor } from "../components/hosting/hangout-editor"
import { HangoutTimeSheet } from "../components/hosting/hangout-time-sheet"
import { useEditHangoutScreen } from "../hooks/hosting/use-edit-hangout-screen"
import type { SnaccHangout } from "../types"

const TITLE = "Edit hangout"

export function EditHangoutScreen({ snaccId }: { snaccId: string }) {
  const back = useBack(snaccPath(snaccId))
  const snacc = useSnacc(snaccId)
  const hangout = snacc.data?.hangout

  if (hangout && snacc.data?.mine) {
    return <Editor snaccId={snaccId} hangout={hangout} />
  }

  return (
    <ComposerScreen>
      <ComposerHeader title={TITLE} onClose={back} />
      {snacc.isPending ? (
        <div className="px-4 pt-4">
          <HangoutBlockSkeleton />
        </div>
      ) : snacc.isError && !isNotFound(snacc.error) ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load this hangout"
            onRetry={() => void snacc.refetch()}
          />
        </div>
      ) : hangout ? (
        <EmptyState
          icon={CalendarXIcon}
          title="Only the host can edit this"
          description="Ask them if something needs to change."
          className="py-24"
        />
      ) : (
        <EmptyState
          icon={CalendarXIcon}
          title="This hangout isn't available"
          description="It may have been deleted."
          className="py-24"
        />
      )}
    </ComposerScreen>
  )
}

function Editor({
  snaccId,
  hangout,
}: {
  snaccId: string
  hangout: SnaccHangout
}) {
  const screen = useEditHangoutScreen(snaccId, hangout)

  return (
    <ComposerScreen className="overflow-y-auto">
      <ComposerHeader title={TITLE} onClose={screen.onBack} />

      <div className="flex-1 px-4 pt-4 pb-6">
        <HangoutEditor {...screen.editor} />
      </div>

      <ComposerBar>
        <div className="flex items-center justify-between px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            disabled={screen.saving || screen.cancelling}
            onClick={screen.onCancel}
          >
            {screen.cancelling ? <Spinner /> : "Call it off"}
          </Button>
          <Button
            size="sm"
            className="h-10 px-5 font-extrabold"
            disabled={!screen.canSave}
            onClick={screen.save}
          >
            {screen.saving ? <Spinner /> : "Save"}
          </Button>
        </div>
      </ComposerBar>

      <HangoutTimeSheet {...screen.timeSheet} />
    </ComposerScreen>
  )
}
