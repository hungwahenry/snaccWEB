import { Cake } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AgeRefused({
  onLogout,
  loggingOut,
}: {
  onLogout: () => void
  loggingOut: boolean
}) {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-between gap-8 px-6 py-10">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <Cake className="size-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            You can&apos;t use Snacc yet
          </h1>
          <p className="text-pretty text-muted-foreground">
            Snacc has a minimum age where you live, so this account can&apos;t
            be set up. Thanks for being honest about your birthday.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          disabled={loggingOut}
          onClick={onLogout}
        >
          Sign out
        </Button>
      </div>
    </main>
  )
}
