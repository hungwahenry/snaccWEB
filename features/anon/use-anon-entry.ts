"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AnonError, sendAnon } from "./api"

const storageKey = (username: string) => `snacc_thread:${username}`

export function useAnonEntry(username: string) {
  const router = useRouter()
  const [existingId, setExistingId] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If this browser already has a thread with this person, offer to reopen it.
  useEffect(() => {
    setExistingId(window.localStorage.getItem(storageKey(username)))
  }, [username])

  const canSend = text.trim().length > 0 && !sending

  async function submit() {
    if (!canSend) return
    setSending(true)
    setError(null)
    try {
      const thread = await sendAnon(username, text.trim())
      window.localStorage.setItem(storageKey(username), thread.conversation_id)
      router.push(`/anon/${thread.conversation_id}`)
      // navigation unmounts us — leave `sending` true so the button stays disabled
    } catch (err) {
      setError(err instanceof AnonError ? err.message : "Couldn't send. Try again.")
      setSending(false)
    }
  }

  return { existingId, text, setText, canSend, sending, error, submit }
}
