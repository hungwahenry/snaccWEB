import { CheckIcon, HandCoinsIcon, LandmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PayFlow } from "../../hooks/pay/use-pay-flow"
import { PartyAvatar } from "../shared/party-avatar"

export function SentPanel({
  target,
  amount,
  requesting,
  line,
  againLabel,
  onDone,
  onAgain,
}: PayFlow["done"]) {
  const Badge = requesting ? HandCoinsIcon : CheckIcon

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-8 px-8 py-10">
      <div className="flex flex-col items-center gap-5">
        <div className="relative animate-in duration-300 zoom-in-50">
          <PartyAvatar
            person={target?.kind === "user" ? target.user : null}
            icon={target ? LandmarkIcon : CheckIcon}
            className="size-24"
            iconClassName="size-10"
            textClassName="text-3xl"
          />
          <span className="absolute -right-1 -bottom-1 flex size-11 items-center justify-center rounded-full border-4 border-background bg-success">
            <Badge className="size-5 text-background" />
          </span>
        </div>

        <p className="truncate text-center text-5xl font-extrabold text-foreground tabular-nums">
          {amount}
        </p>

        <p className="text-center text-base leading-6 text-muted-foreground">
          {line}
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button size="lg" className="h-14 text-base" onClick={onDone}>
          Done
        </Button>
        {againLabel ? (
          <Button
            size="lg"
            variant="outline"
            className="h-14 text-base"
            onClick={onAgain}
          >
            {againLabel}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
