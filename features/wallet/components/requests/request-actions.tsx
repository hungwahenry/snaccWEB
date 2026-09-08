import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type Props = { busy: boolean; className?: string } & (
  | { box: "incoming"; onPay: () => void; onDecline: () => void }
  | { box: "outgoing"; onCancel: () => void }
)

export function RequestActions(props: Props) {
  return (
    <div className={cn("flex gap-2", props.className)}>
      {props.box === "incoming" ? (
        <>
          <Quiet label="Decline" busy={props.busy} onPress={props.onDecline} />
          <button
            type="button"
            onClick={props.onPay}
            disabled={props.busy}
            className="flex h-10 flex-1 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            {props.busy ? (
              <Spinner className="text-primary-foreground" />
            ) : (
              "Pay"
            )}
          </button>
        </>
      ) : (
        <Quiet
          label="Cancel request"
          busy={props.busy}
          onPress={props.onCancel}
        />
      )}
    </div>
  )
}

function Quiet({
  label,
  busy,
  onPress,
}: {
  label: string
  busy: boolean
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={busy}
      className="flex h-10 flex-1 items-center justify-center rounded-full border border-border text-sm font-bold text-muted-foreground transition-opacity active:opacity-60 disabled:opacity-70"
    >
      {busy ? <Spinner className="text-muted-foreground" /> : label}
    </button>
  )
}
