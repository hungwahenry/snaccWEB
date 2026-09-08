import { HandCoinsIcon, LandmarkIcon, SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { BackHeader } from "@/features/navigation/components/back-header"
import { formatNaira } from "@/lib/format"
import type { PayFlow } from "../../hooks/pay/use-pay-flow"
import { DetailLine, DetailLines } from "../shared/detail-line"

export function ReviewStep({ flow }: { flow: PayFlow }) {
  const requesting = flow.mode === "request"
  const target = flow.target
  if (!target) return null
  const bankNumber =
    target.kind === "bank"
      ? "accountNumber" in target.source
        ? target.source.accountNumber
        : `••${target.accountLast4}`
      : null
  const Badge = requesting ? HandCoinsIcon : SendIcon

  return (
    <>
      <BackHeader title="Review" onBack={flow.backFromReview} divider={false} />

      <div className="flex flex-col gap-8 px-6 pt-6 pb-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {target.kind === "bank" ? (
              <span className="flex size-28 items-center justify-center rounded-full bg-muted">
                <LandmarkIcon className="size-12 text-foreground" />
              </span>
            ) : (
              <UserAvatar
                alt={target.user.display_name ?? "User"}
                className="size-28"
                textClassName="text-4xl"
                avatarUrl={target.user.avatar_url}
                name={target.user.username}
              />
            )}
            <span className="absolute -right-1 -bottom-1 flex size-10 items-center justify-center rounded-full border-4 border-background bg-primary">
              <Badge className="size-4 text-primary-foreground" />
            </span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <p className="truncate text-2xl font-extrabold text-foreground">
              {target.kind === "bank"
                ? target.accountName
                : `@${target.user.username}`}
            </p>
            <p className="truncate text-base text-muted-foreground">
              {target.kind === "bank"
                ? `${target.bankName} · ${bankNumber}`
                : (target.user.display_name ?? "")}
            </p>
          </div>
        </div>

        <DetailLines>
          <DetailLine
            label={requesting ? "You are asking for" : "You are sending"}
            value={flow.amountLabel}
            hero
          />
          {flow.fee > 0 ? (
            <DetailLine label="Bank fee" value={formatNaira(flow.fee)} />
          ) : null}
          {flow.fee > 0 ? (
            <DetailLine label="Total" value={formatNaira(flow.total)} />
          ) : null}
          {flow.balanceAfter !== null ? (
            <DetailLine
              label="Balance after"
              value={formatNaira(flow.balanceAfter)}
            />
          ) : null}
        </DetailLines>

        {target.kind === "user" ? (
          <Input
            value={flow.note}
            onChange={(event) => flow.setNote(event.target.value)}
            placeholder={
              requesting
                ? "What is it for? (optional)"
                : "Add a note (optional)"
            }
            maxLength={140}
            className="h-14 rounded-full px-5 text-base md:text-base"
          />
        ) : null}

        <p className="text-center text-sm leading-6 text-muted-foreground">
          {requesting
            ? "They get a request and can pay it in one tap. Nothing moves until they do."
            : target.kind === "bank"
              ? "Bank sends cannot be reversed once they leave Snacc. Check the name above carefully."
              : "Sends between Snacc users land instantly and cannot be reversed."}
        </p>

        <Button
          size="lg"
          className="h-14 text-base"
          disabled={flow.submitting}
          onClick={flow.submit}
        >
          {flow.submitting ? (
            <Spinner />
          ) : requesting ? (
            `Request ${flow.amountLabel}`
          ) : (
            `Send ${formatNaira(flow.total)}`
          )}
        </Button>
      </div>
    </>
  )
}
