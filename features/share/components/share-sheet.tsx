import { CopyIcon, SendIcon, ShareIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { Conversation } from "@/features/messages/types"
import type { ShareSubject } from "../types"
import { RecipientGrid } from "./recipient-grid"

export type ShareSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: ShareSubject | null
  label: string
  canShareNative: boolean
  onCopyLink: () => void
  onShareLink: () => void
  recipients: {
    enabled: boolean
    conversations: Conversation[]
    loading: boolean
    picked: string[]
    onToggle: (conversationId: string) => void
    note: string
    onNote: (value: string) => void
    onSend: () => void
    sending: boolean
  }
}

export function ShareSheet({
  open,
  onOpenChange,
  subject,
  label,
  canShareNative,
  onCopyLink,
  onShareLink,
  recipients,
}: ShareSheetProps) {
  const sending = recipients.enabled && recipients.picked.length > 0

  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Share"
      hint={subject ? `They'll get a link to this ${label}.` : undefined}
      footer={
        sending ? (
          <div className="flex flex-col gap-2">
            <Input
              value={recipients.note}
              onChange={(event) => recipients.onNote(event.target.value)}
              placeholder="Say something…"
              maxLength={2000}
              className="h-11 rounded-full px-4"
            />
            <Button
              className="h-11 w-full"
              disabled={recipients.sending}
              onClick={recipients.onSend}
            >
              {recipients.sending ? (
                <Spinner />
              ) : (
                <>
                  <SendIcon /> Send to {recipients.picked.length}{" "}
                  {recipients.picked.length === 1 ? "person" : "people"}
                </>
              )}
            </Button>
          </div>
        ) : subject ? (
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={onCopyLink}>
              <CopyIcon /> Copy link
            </Button>
            {canShareNative ? (
              <Button variant="ghost" className="flex-1" onClick={onShareLink}>
                <ShareIcon /> More
              </Button>
            ) : null}
          </div>
        ) : undefined
      }
      tall={recipients.enabled}
    >
      {recipients.enabled ? (
        <div className="px-4 pb-2">
          <RecipientGrid
            conversations={recipients.conversations}
            loading={recipients.loading}
            picked={recipients.picked}
            onToggle={recipients.onToggle}
          />
        </div>
      ) : null}
    </ActionSheet>
  )
}
