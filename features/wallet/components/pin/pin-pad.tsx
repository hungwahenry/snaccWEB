import { Keypad } from "@/components/ui/keypad"
import { cn } from "@/lib/utils"
import { pinDots } from "../../utils/pin"

export function PinPad({
  value,
  onKey,
  title,
  hint,
  error,
  className,
}: {
  value: string
  onKey: (key: string) => void
  title: string
  hint?: string | null
  error?: string | null
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex flex-col items-center gap-5 px-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-2xl font-extrabold text-foreground">
            {title}
          </p>
          {hint ? (
            <p className="text-center text-base leading-6 text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        <div className="flex gap-4">
          {pinDots(value).map((filled, index) => (
            <span
              key={index}
              className={cn(
                "size-4 rounded-full border-2",
                filled
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/40"
              )}
            />
          ))}
        </div>
        {error ? (
          <p className="text-center text-sm text-destructive">{error}</p>
        ) : null}
      </div>
      <Keypad onKey={onKey} decimal={false} />
    </div>
  )
}
