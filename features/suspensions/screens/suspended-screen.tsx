"use client"

import { Button } from "@/components/ui/button"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { SuspensionNotice } from "../components/suspension-notice"
import { useSuspension } from "../hooks/use-suspension"

export function SuspendedScreen() {
  const suspension = useSuspension()
  const logout = useLogout()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-6 py-10">
      {suspension.isPending ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : suspension.isError ? (
        <div className="flex flex-1 flex-col justify-center">
          <LoadFailed
            title="Couldn't load your suspension"
            onRetry={() => void suspension.refetch()}
          />
        </div>
      ) : suspension.data ? (
        <div className="flex flex-1 flex-col justify-center">
          <SuspensionNotice suspension={suspension.data} />
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="h-12"
          disabled={suspension.isFetching}
          onClick={() => void suspension.refetch()}
        >
          {suspension.isFetching ? <Spinner /> : "Check again"}
        </Button>
        <Button
          variant="ghost"
          className="h-12 text-muted-foreground"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          {logout.isPending ? <Spinner /> : "Sign out"}
        </Button>
      </div>
    </div>
  )
}
