import { LandmarkIcon } from "lucide-react"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { SendTarget } from "../../hooks/pay/use-pay-recipient"

export function TargetLine({ target }: { target: SendTarget }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {target.kind === "user" ? (
        <UserAvatar
          alt={target.user.display_name ?? "User"}
          className="size-6"
          textClassName="text-[10px]"
          avatarUrl={target.user.avatar_url}
          name={target.user.username}
        />
      ) : (
        <span className="flex size-6 items-center justify-center rounded-full bg-muted">
          <LandmarkIcon className="size-3.5 text-foreground" />
        </span>
      )}
      <span className="text-sm text-muted-foreground">
        To{" "}
        <span className="font-bold text-foreground">
          {target.kind === "user"
            ? `@${target.user.username}`
            : `${target.bankName} ••${target.accountLast4}`}
        </span>
      </span>
    </div>
  )
}
