"use client"

import { useEffect, useState } from "react"
import { AnonError, readAnonThread, replyAnon, sendAnon } from "./api"
import type { AnonRecipient, AnonThread } from "./public"

const storageKey = (username: string) => `snacc_thread:${username}`

export function useAnonSender(recipient: AnonRecipient) {
  const username = recipient.username ?? ""
  const [thread, setThread] = useState<AnonThread | null>(null)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walled, setWalled] = useState(false)
  const [restoring, setRestoring] = useState(true)

  // Cookie-return: if this browser already has a thread with this person, bring it back.
  useEffect(() => {
    const id = window.localStorage.getItem(storageKey(username))
    if (!id) {
      setRestoring(false)
      return
    }
    let active = true
    readAnonThread(id).then((restored) => {
      if (!active) return
      if (restored) {
        setThread(restored)
        if (restored.remaining === 0) setWalled(true)
      } else {
        window.localStorage.removeItem(storageKey(username))
      }
      setRestoring(false)
    })
    return () => {
      active = false
    }
  }, [username])

  const canSend = text.trim().length > 0 && !sending

  async function submit() {
    if (!canSend) return
    setSending(true)
    setError(null)
    const body = text.trim()
    try {
      const next = thread
        ? await replyAnon(thread.conversation_id, body)
        : await sendAnon(username, body)
      window.localStorage.setItem(storageKey(username), next.conversation_id)
      setThread(next)
      setText("")
      if (next.remaining === 0) setWalled(true)
    } catch (err) {
      if (err instanceof AnonError && err.code === "guest_limit_reached") setWalled(true)
      else setError(err instanceof AnonError ? err.message : "Couldn't send. Try again.")
    } finally {
      setSending(false)
    }
  }

  return { recipient, thread, text, setText, canSend, sending, error, walled, restoring, submit }
}
