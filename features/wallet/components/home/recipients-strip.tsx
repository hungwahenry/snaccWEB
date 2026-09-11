"use client"

import { useLongPress } from "@/hooks/use-long-press"
import type { WalletRecipient } from "../../types"
import { recipientLabel } from "../../utils/recipients"
import { PartyAvatar } from "../shared/party-avatar"

export function RecipientsStrip({
  items,
  onPress,
  onLongPress,
}: {
  items: WalletRecipient[]
  onPress: (recipient: WalletRecipient) => void
  onLongPress: (recipient: WalletRecipient) => void
}) {
  if (items.length === 0) return null

  return (
    <div className="flex [scrollbar-width:none] gap-4 overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden">
      {items.map((recipient) => (
        <RecipientChip
          key={recipient.id}
          recipient={recipient}
          onPress={() => onPress(recipient)}
          onLongPress={() => onLongPress(recipient)}
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
  onLongPress: () => void
}) {
  const longPress = useLongPress(onLongPress)

  return (
    <button
      type="button"
      {...longPress}
      onClick={onPress}
      onContextMenu={(event) => {
        event.preventDefault()
        onLongPress()
      }}
      className="flex w-16 shrink-0 flex-col items-center gap-1.5 transition-transform active:scale-95"
    >
      <PartyAvatar
        person={recipient.user}
        className="size-14"
        iconClassName="size-6"
      />
      <span className="w-full truncate text-center text-xs text-muted-foreground">
        {recipientLabel(recipient).short}
      </span>
    </button>
  )
}
