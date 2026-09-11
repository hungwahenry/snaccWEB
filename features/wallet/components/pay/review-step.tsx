import { HandCoinsIcon, SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { BackHeader } from "@/features/navigation/components/back-header"
import type { PayFlow } from "../../hooks/pay/use-pay-flow"
import { DetailLine, DetailLines } from "../shared/detail-line"
import { PartyAvatar } from "../shared/party-avatar"
import { FixPill } from "./fix-pill"

export function ReviewStep({
  target,
  label,
  requesting,
  lines,
  showNote,
  note,
  setNote,
  noteMax,
  notePlaceholder,
  footnote,
  problem,
  fix,
  submitLabel,
  ready,
  submitting,
  onBack,
  onSubmit,
}: NonNullable<PayFlow["review"]>) {
  const Badge = requesting ? HandCoinsIcon : SendIcon

  return (
    <>
      <BackHeader title="Review" onBack={onBack} divider={false} />

      <div className="flex flex-col gap-8 px-6 pt-6 pb-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <PartyAvatar
              person={target.kind === "user" ? target.user : null}
              className="size-28"
              iconClassName="size-12"
              textClassName="text-4xl"
            />
            <span className="absolute -right-1 -bottom-1 flex size-10 items-center justify-center rounded-full border-4 border-background bg-primary">
              <Badge className="size-4 text-primary-foreground" />
            </span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <p className="truncate text-2xl font-extrabold text-foreground">
              {label.title}
            </p>
            {label.subtitle ? (
              <p className="truncate text-base text-muted-foreground">
                {label.subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <DetailLines>
          {lines.map((line) => (
            <DetailLine key={line.label} {...line} />
          ))}
        </DetailLines>

        {problem ? (
          <div className="flex flex-col gap-3">
            <p className="text-center text-sm text-destructive">{problem}</p>
            {fix ? <FixPill label={fix.label} onPress={fix.onPress} /> : null}
          </div>
        ) : null}

        {showNote ? (
          <Input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={notePlaceholder}
            maxLength={noteMax}
            className="h-14 rounded-full px-5 text-base md:text-base"
          />
        ) : null}

        <p className="text-center text-sm leading-6 text-muted-foreground">
          {footnote}
        </p>

        <Button
          size="lg"
          className="h-14 text-base"
          disabled={!ready || submitting}
          onClick={onSubmit}
        >
          {submitting ? <Spinner /> : submitLabel}
        </Button>
      </div>
    </>
  )
}
