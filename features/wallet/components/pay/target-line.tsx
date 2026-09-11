import type { PartyLabel, SendTarget } from "../../types"
import { PartyAvatar } from "../shared/party-avatar"

export function TargetLine({
  target,
  label,
}: {
  target: SendTarget
  label: PartyLabel
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <PartyAvatar
        person={target.kind === "user" ? target.user : null}
        className="size-6"
        iconClassName="size-3.5"
        textClassName="text-[10px]"
      />
      <span className="text-sm text-muted-foreground">
        To <span className="font-bold text-foreground">{label.short}</span>
      </span>
    </div>
  )
}
