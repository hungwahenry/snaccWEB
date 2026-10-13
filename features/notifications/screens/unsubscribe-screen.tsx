"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useUnsubscribeScreen } from "../hooks/use-unsubscribe-screen"
import { NOTIFICATION_SETTINGS_PATH } from "../routes"

export function UnsubscribeScreen({ token }: { token: string }) {
  const screen = useUnsubscribeScreen(token)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-6 py-10">
      {screen.loading ? (
        <div className="flex justify-center">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : screen.invalid ? (
        <p className="text-base text-pretty text-muted-foreground">
          {screen.problem ??
            "That unsubscribe link doesn't work. You can turn emails off in Settings → Notifications."}
        </p>
      ) : screen.stopped ? (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Done</h1>
          <p className="text-base text-pretty text-muted-foreground">
            You won&apos;t get{" "}
            {screen.subject?.everything ? "emails" : "these emails"} from Snacc
            any more. Notifications in the app are unchanged.
          </p>
          <Link
            href={NOTIFICATION_SETTINGS_PATH}
            className="text-sm font-semibold text-foreground underline"
          >
            Notification settings
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-balance">
              Stop {screen.subject?.everything ? "all emails" : "these emails"}?
            </h1>
            <p className="text-base text-pretty text-muted-foreground">
              {screen.subject?.everything
                ? "Snacc won't email you about activity any more. Sign-in codes and account emails still arrive."
                : `Snacc won't email you about ${screen.subject?.label.toLowerCase()} any more.`}
            </p>
          </div>
          {screen.error ? (
            <p className="text-sm text-destructive">{screen.error}</p>
          ) : null}
          <Button
            size="lg"
            className="h-12"
            disabled={screen.stopping}
            onClick={screen.stop}
          >
            {screen.stopping ? <Spinner /> : "Unsubscribe"}
          </Button>
        </div>
      )}
    </main>
  )
}
