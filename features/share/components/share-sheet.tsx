import { CopyIcon, SendIcon, ShareIcon } from "lucide-react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { Conversation } from "@/features/messages/types"
import { bareLink } from "@/lib/share-links"
import type { ShareSubject } from "../types"
import { RecipientGrid } from "./recipient-grid"

export type ShareSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: ShareSubject | null
  link: string
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
  link,
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
        ) : undefined
      }
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
      {link ? (
        <p className="truncate px-5 pb-1 text-xs text-muted-foreground">
          {bareLink(link)}
        </p>
      ) : null}
      <ActionSheetChoice
        icon={CopyIcon}
        label="Copy link"
        hint="Paste it anywhere"
        onPress={onCopyLink}
      />
      {canShareNative ? (
        <ActionSheetChoice
          icon={ShareIcon}
          label="Share to…"
          hint="Messages, WhatsApp, and more"
          onPress={onShareLink}
        />
      ) : null}
    </ActionSheet>
  )
}
