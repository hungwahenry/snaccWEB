import { ArrowLeftIcon, FlagIcon } from "lucide-react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { ReportReason } from "../types"

export type ReportSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  reasons: ReportReason[]
  loading: boolean
  failed: boolean
  retry: () => void
  sending: boolean
  detailMaxLength: number
  asking: ReportReason | null
  detail: string
  canSend: boolean
  onDetailChange: (detail: string) => void
  onPick: (reason: ReportReason) => void
  onBack: () => void
  onSend: () => void
}

export function ReportSheet({
  open,
  onOpenChange,
  title,
  reasons,
  loading,
  failed,
  retry,
  sending,
  detailMaxLength,
  asking,
  detail,
  canSend,
  onDetailChange,
  onPick,
  onBack,
  onSend,
}: ReportSheetProps) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={asking ? asking.label : title}
      hint={asking ? undefined : "Only you can see that you reported this."}
      footer={
        asking ? (
          <Button
            className="h-12 w-full"
            disabled={!canSend || sending}
            onClick={onSend}
          >
            {sending ? <Spinner /> : "Report"}
          </Button>
        ) : undefined
      }
    >
      {failed ? (
        <LoadFailed title="Could not load the reasons" onRetry={retry} />
      ) : loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : asking ? (
        <div className="flex flex-col gap-1.5 px-5 pt-1">
          <div className="flex items-center gap-1">
            <IconButton
              icon={ArrowLeftIcon}
              label="Back to reasons"
              onClick={onBack}
              className="-ml-2 size-8"
              iconClassName="size-5"
            />
            <span className="text-sm text-muted-foreground">
              Add a few words
            </span>
          </div>
          <Textarea
            className="min-h-40 text-base"
            value={detail}
            onChange={(event) => onDetailChange(event.target.value)}
            placeholder="What's wrong with it?"
            maxLength={detailMaxLength}
            autoFocus
          />
          <span
            className={cn(
              "self-end text-xs text-muted-foreground",
              detail.length >= detailMaxLength && "text-destructive"
            )}
          >
            {detail.length}/{detailMaxLength}
          </span>
        </div>
      ) : (
        reasons.map((reason) => (
          <ActionSheetChoice
            key={reason.id}
            icon={FlagIcon}
            label={reason.label}
            hint={reason.hint ?? undefined}
            onPress={() => onPick(reason)}
          />
        ))
      )}
    </ActionSheet>
  )
}
