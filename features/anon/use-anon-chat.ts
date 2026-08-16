"use client"

import { useEffect, useRef, useState } from "react"
import { AnonError, readAnonThread, replyAnon } from "./api"
import type { AnonThread } from "./public"

const POLL_MS = 8000

export function useAnonChat(conversationId: string) {
  const [thread, setThread] = useState<AnonThread | null>(null)
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walled, setWalled] = useState(false)
  const inFlight = useRef(false)

  function apply(next: AnonThread | null) {
    if (!next) return
    setThread(next)
    if (next.remaining === 0) setWalled(true)
  }

  // Initial load.
  useEffect(() => {
    let active = true
    readAnonThread(conversationId).then((next) => {
      if (!active) return
      if (next) apply(next)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [conversationId])

  // Poll for the recipient's replies while the tab is visible (instant on refocus).
  useEffect(() => {
    async function refresh() {
      if (document.visibilityState !== "visible" || inFlight.current) return
      inFlight.current = true
      try {
        apply(await readAnonThread(conversationId))
      } finally {
        inFlight.current = false
      }
    }

    const timer = setInterval(refresh, POLL_MS)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [conversationId])

  const canSend = text.trim().length > 0 && !sending && !walled

  async function submit() {
    if (!canSend) return
    setSending(true)
    setError(null)
    try {
      apply(await replyAnon(conversationId, text.trim()))
      setText("")
    } catch (err) {
      if (err instanceof AnonError && err.code === "guest_limit_reached") setWalled(true)
      else setError(err instanceof AnonError ? err.message : "Couldn't send. Try again.")
    } finally {
      setSending(false)
    }
  }

  return { thread, loading, text, setText, canSend, sending, error, walled, submit }
}
