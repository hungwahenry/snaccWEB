"use client"

import { Button } from "@/components/ui/button"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { BirthDateFields } from "../components/birth-date-fields"
import { useBirthDateScreen } from "../hooks/use-birth-date-screen"

export function BirthDateScreen() {
  const screen = useBirthDateScreen()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-6 py-10">
      {screen.loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : screen.failed ? (
        <div className="flex flex-1 flex-col justify-center">
          <LoadFailed
            title="Couldn't load your profile"
            onRetry={screen.retry}
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-balance">
              When were you born?
            </h1>
            <p className="text-base text-pretty text-muted-foreground">
              Snacc now checks everyone is old enough to use it. People only
              ever see your birthday, never the year. You can only set this
              once.
            </p>
          </div>

          <BirthDateFields
            value={screen.draft}
            onChange={screen.setDraft}
            known={screen.knownBirthday}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {screen.error ? (
          <p className="text-center text-sm text-destructive">{screen.error}</p>
        ) : null}
        <Button
          size="lg"
          className="h-12"
          disabled={!screen.canSave || screen.saving}
          onClick={screen.save}
        >
          {screen.saving ? <Spinner /> : "Save"}
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
