"use client"

import { ArrowUpRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { useAgreeScreen } from "../hooks/use-agree-screen"
import { legalPath } from "../routes"

export function AgreeScreen() {
  const screen = useAgreeScreen()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-6 py-10">
      {screen.loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : screen.failed ? (
        <div className="flex flex-1 flex-col justify-center">
          <LoadFailed title="Couldn't load the terms" onRetry={screen.retry} />
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-balance">
              We&apos;ve updated our terms
            </h1>
            <p className="text-base text-pretty text-muted-foreground">
              Please read what changed and agree to keep using Snacc.
            </p>
          </div>

          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border">
            {screen.documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={legalPath(doc.kind, screen.country)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold hover:bg-muted/50"
                >
                  <span className="flex flex-col">
                    {doc.title}
                    <span className="text-xs font-normal text-muted-foreground">
                      Version {doc.version}
                    </span>
                  </span>
                  <ArrowUpRightIcon className="size-4 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {screen.error ? (
          <p className="text-center text-sm text-destructive">{screen.error}</p>
        ) : null}
        <Button
          size="lg"
          className="h-12"
          disabled={screen.loading || screen.agreeing}
          onClick={screen.agree}
        >
          {screen.agreeing ? <Spinner /> : "Agree and continue"}
        </Button>
        <Button
          variant="ghost"
          className="h-12 text-muted-foreground"
          disabled={screen.signingOut}
          onClick={screen.signOut}
        >
          {screen.signingOut ? <Spinner /> : "Sign out"}
        </Button>
      </div>
    </div>
  )
}
