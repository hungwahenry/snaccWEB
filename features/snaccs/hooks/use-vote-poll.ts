"use client"

import { useState } from "react"
import { votePoll } from "../api"
import { patchSnacc } from "../cache"
import { showError } from "@/lib/feedback"

export function useVotePoll() {
  const [votingFor, setVotingFor] = useState<string | null>(null)

  async function vote(snaccId: string, optionId: string) {
    if (votingFor) return
    setVotingFor(snaccId)
    try {
      const fresh = await votePoll(snaccId, optionId)
      patchSnacc(snaccId, (snacc) => ({ ...snacc, poll: fresh }))
    } catch (error) {
      showError(error)
    } finally {
      setVotingFor(null)
    }
  }

  return {
    votingFor,
    vote: (snaccId: string, optionId: string) => void vote(snaccId, optionId),
  }
}
