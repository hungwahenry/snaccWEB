import { CheckIcon, HandCoinsIcon, LandmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { formatNaira } from "@/lib/format"
import type { PayFlow } from "../../hooks/pay/use-pay-flow"

export function SentPanel({ flow }: { flow: PayFlow }) {
  const target = flow.target
  const requesting = flow.mode === "request"
  const topUp = flow.mode === "topup"
  const Badge = requesting ? HandCoinsIcon : CheckIcon

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-8 px-8 py-10">
      <div className="flex flex-col items-center gap-5">
        <div className="relative animate-in duration-300 zoom-in-50">
          {target?.kind === "user" ? (
            <UserAvatar
              alt={target.user.display_name ?? "User"}
              className="size-24"
              textClassName="text-3xl"
              avatarUrl={target.user.avatar_url}
              name={target.user.username}
            />
          ) : (
            <span className="flex size-24 items-center justify-center rounded-full bg-muted">
              {topUp ? (
                <CheckIcon className="size-10 text-foreground" />
              ) : (
                <LandmarkIcon className="size-10 text-foreground" />
              )}
            </span>
          )}
          <span className="bg-success absolute -right-1 -bottom-1 flex size-11 items-center justify-center rounded-full border-4 border-background">
            <Badge className="size-5 text-background" />
          </span>
        </div>

        <p className="truncate text-center text-5xl font-extrabold text-foreground tabular-nums">
          {formatNaira(flow.amountKobo)}
        </p>

        <p className="text-center text-base leading-6 text-muted-foreground">
          {requesting
            ? `Asked ${flow.done}. Nothing moves until they pay.`
            : topUp
              ? "Added to your wallet."
              : `Sent to ${flow.done}.`}
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button size="lg" className="h-14 text-base" onClick={flow.finish}>
          Done
        </Button>
        {!topUp ? (
          <Button
            size="lg"
            variant="outline"
            className="h-14 text-base"
            onClick={flow.again}
          >
            {requesting ? "Ask someone else" : "Send another"}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
