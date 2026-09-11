import {
  BellIcon,
  BellRingIcon,
  HandCoinsIcon,
  SendHorizontalIcon,
} from "lucide-react"
import { Bump } from "@/components/motion/bump"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { VisitorsButton } from "@/features/profile-views/components/visitors-button"
import { cn } from "@/lib/utils"

const ROUND = "border border-border"

export function OwnProfileActions({
  visitors,
  onEdit,
}: {
  visitors: { count: number; loading: boolean } | null
  onEdit: () => void
}) {
  return (
    <>
      {visitors ? (
        <VisitorsButton count={visitors.count} loading={visitors.loading} />
      ) : null}
      <Button variant="outline" onClick={onEdit}>
        Edit profile
      </Button>
    </>
  )
}

export type ProfileActionsProps = {
  payLabel: string | null
  messageLabel: string | null
  following: boolean
  notifying: boolean
  notifyLabel: string
  followLabel: string
  onPay: () => void
  onMessage: () => void
  onToggleNotify: () => void
  onToggleFollow: () => void
}

export function ProfileActions({
  payLabel,
  messageLabel,
  following,
  notifying,
  notifyLabel,
  followLabel,
  onPay,
  onMessage,
  onToggleNotify,
  onToggleFollow,
}: ProfileActionsProps) {
  return (
    <>
      {payLabel ? (
        <IconButton
          icon={HandCoinsIcon}
          label={payLabel}
          onClick={onPay}
          className={ROUND}
          iconClassName="size-5"
        />
      ) : null}
      {messageLabel ? (
        <IconButton
          icon={SendHorizontalIcon}
          label={messageLabel}
          onClick={onMessage}
          className={ROUND}
          iconClassName="size-5"
        />
      ) : null}
      {following ? (
        <IconButton
          icon={notifying ? BellRingIcon : BellIcon}
          label={notifyLabel}
          aria-pressed={notifying}
          onClick={onToggleNotify}
          className={cn(
            "border",
            notifying
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-border"
          )}
          iconClassName="size-5"
        />
      ) : null}
      <Button
        variant={following ? "outline" : "default"}
        onClick={onToggleFollow}
      >
        <Bump value={following}>{followLabel}</Bump>
      </Button>
    </>
  )
}
