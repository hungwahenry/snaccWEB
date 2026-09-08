"use client"

import { useState } from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { votePoll } from "../api"
import { patchSnacc } from "../cache"

export function useVotePoll() {
  const [votingFor, setVotingFor] = useState<string | null>(null)

  async function vote(snaccId: string, optionId: string) {
    if (votingFor) return
    setVotingFor(snaccId)
    try {
      const fresh = await votePoll(snaccId, optionId)
      patchSnacc(snaccId, (snacc) => ({ ...snacc, poll: fresh }))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setVotingFor(null)
    }
  }

  return {
    votingFor,
    vote: (snaccId: string, optionId: string) => void vote(snaccId, optionId),
  }
}
