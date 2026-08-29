"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState, useSyncExternalStore } from "react"
import { AnonError, sendAnon } from "../api"

const storageKey = (username: string) => `snacc_thread:${username}`

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange)
  return () => window.removeEventListener("storage", onChange)
}

export function useAnonEntry(username: string) {
  const router = useRouter()
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If this browser already has a thread with this person, offer to reopen it. It lives in
  // localStorage, so it is read from there rather than copied into state on mount.
  const read = useCallback(
    () => window.localStorage.getItem(storageKey(username)),
    [username]
  )
  const existingId = useSyncExternalStore(subscribeToStorage, read, () => null)

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
      setError(
        err instanceof AnonError ? err.message : "Couldn't send. Try again."
      )
      setSending(false)
    }
  }

  return { existingId, text, setText, canSend, sending, error, submit }
}
