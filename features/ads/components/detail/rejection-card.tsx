import type { Campaign } from "../../types"

export function RejectionCard({
  rejection,
}: {
  rejection: NonNullable<Campaign["rejection"]>
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-destructive/10 p-4">
      <p className="text-sm font-bold text-destructive">{rejection.label}</p>
      <p className="text-sm leading-5 text-pretty text-foreground">
        {rejection.description}
      </p>
      {rejection.note ? (
        <p className="text-sm leading-5 text-pretty text-muted-foreground">
          “{rejection.note}”
        </p>
      ) : null}
    </div>
  )
}
