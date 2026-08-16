"use client"

import { Button } from "@/components/ui/button"
import type { useChallengeMutations } from "./use-challenges"
import type { AdminChallenge } from "./types"

export function ChallengeStatusAction({
  challenge,
  mutations,
}: {
  challenge: AdminChallenge
  mutations: ReturnType<typeof useChallengeMutations>
}) {
  if (challenge.status === "draft") {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={mutations.update.isPending}
        onClick={() => mutations.update.mutate({ id: challenge.id, input: { status: "active" } })}
      >
        Activate
      </Button>
    )
  }
  if (challenge.status === "active") {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={mutations.update.isPending}
        onClick={() => mutations.update.mutate({ id: challenge.id, input: { status: "ended" } })}
      >
        End
      </Button>
    )
  }
  return null
}
