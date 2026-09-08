"use client"

import { LandmarkIcon } from "lucide-react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useLongPress } from "@/hooks/use-long-press"
import type { WalletRecipient } from "../../types"

export function RecipientsStrip({
  recipients,
  onPress,
  onLongPress,
}: {
  recipients: WalletRecipient[]
  onPress: (recipient: WalletRecipient) => void
  onLongPress?: (recipient: WalletRecipient) => void
}) {
  if (recipients.length === 0) return null

  return (
    <div className="flex [scrollbar-width:none] gap-4 overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden">
      {recipients.map((recipient) => (
        <RecipientChip
          key={recipient.id}
          recipient={recipient}
          onPress={() => onPress(recipient)}
          onLongPress={onLongPress ? () => onLongPress(recipient) : undefined}
        />
      ))}
    </div>
  )
}

function RecipientChip({
  recipient,
  onPress,
  onLongPress,
}: {
  recipient: WalletRecipient
  onPress: () => void
  onLongPress?: () => void
}) {
  const longPress = useLongPress(onLongPress)

  return (
    <button
      type="button"
      {...longPress}
      onClick={onPress}
      onContextMenu={
        onLongPress
          ? (event) => {
              event.preventDefault()
              onLongPress()
            }
          : undefined
      }
      className="flex w-16 shrink-0 flex-col items-center gap-1.5 transition-transform active:scale-95"
    >
      {recipient.kind === "user" && recipient.user ? (
        <UserAvatar
          alt={recipient.user.display_name ?? "User"}
          className="size-14"
          avatarUrl={recipient.user.avatar_url}
          name={recipient.user.username}
        />
      ) : (
        <span className="flex size-14 items-center justify-center rounded-full bg-muted">
          <LandmarkIcon className="size-6 text-foreground" />
        </span>
      )}
      <span className="w-full truncate text-center text-xs text-muted-foreground">
        {recipient.kind === "user"
          ? `@${recipient.user?.username ?? ""}`
          : (recipient.bank?.bank_name ?? "Bank")}
      </span>
    </button>
  )
}
