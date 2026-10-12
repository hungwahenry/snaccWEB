"use client"

import { Button } from "@/components/ui/button"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { CampusSearchField } from "@/features/universities/components/campus-search-field"
import { WaitingNotice } from "../components/waiting-notice"
import { useWaitingScreen } from "../hooks/use-waiting-screen"

export function WaitingScreen() {
  const screen = useWaitingScreen()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-6 py-10">
      {screen.loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : screen.failed ? (
        <div className="flex flex-1 flex-col justify-center">
          <LoadFailed
            title="Couldn't check your campus"
            onRetry={screen.check}
          />
        </div>
      ) : screen.availability ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <WaitingNotice availability={screen.availability} />

          {screen.picking ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">
                Your campus
              </p>
              <CampusSearchField {...screen.choice} />
              <Button
                className="h-12"
                disabled={!screen.canSave || screen.saving}
                onClick={screen.save}
              >
                {screen.saving ? <Spinner /> : "Save campus"}
              </Button>
              <Button
                variant="ghost"
                className="h-12 text-muted-foreground"
                onClick={screen.stopPicking}
              >
                Keep my campus
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="h-12"
              onClick={screen.startPicking}
            >
              Picked the wrong campus?
            </Button>
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="h-12"
          disabled={screen.checking}
          onClick={screen.check}
        >
          {screen.checking ? <Spinner /> : "Check again"}
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
