import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function AccountPending({
  checking,
  onCheck,
}: {
  checking: boolean
  onCheck: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-8 py-24">
      <Spinner className="text-muted-foreground" />
      <p className="text-center text-xl font-extrabold text-foreground">
        Opening your account number…
      </p>
      <p className="text-center text-sm text-muted-foreground">
        This usually takes a moment. We will notify you when it is ready.
      </p>
      <Button
        variant="outline"
        className="h-12"
        disabled={checking}
        onClick={onCheck}
      >
        {checking ? <Spinner /> : "Check again"}
      </Button>
    </div>
  )
}
