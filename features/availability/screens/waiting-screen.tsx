"use client"

import { Button } from "@/components/ui/button"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { CampusPickerSheet } from "@/features/universities/components/campus-picker-sheet"
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

          <Button
            variant="ghost"
            className="h-12"
            disabled={screen.changing}
            onClick={screen.changeCampus}
          >
            {screen.changing ? <Spinner /> : "Picked the wrong campus?"}
          </Button>
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

      <CampusPickerSheet title="Change campus" {...screen.campusSheet} />
    </div>
  )
}
