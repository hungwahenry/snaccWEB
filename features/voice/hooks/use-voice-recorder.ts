"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { showErrorMessage } from "@/lib/feedback"
import type { VoiceDraft } from "../types"
import { decibelsOf, levelFromMetering } from "../utils/levels"
import { micErrorMessage, MIN_TAKE_MS, pickMimeType } from "../utils/recording"

const TRAIL = 72
const TICK_MS = 90

export function useVoiceRecorder() {
  const [recording, setRecording] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const [durationMs, setDurationMs] = useState(0)
  const [levels, setLevels] = useState<number[]>([])

  const recorder = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const audio = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const chunks = useRef<Blob[]>([])
  const startedAt = useRef(0)
  const timer = useRef<number | null>(null)
  const armed = useRef(false)
  // The finger can lift while start() is still asking for the mic; the release must win.
  const releaseRequested = useRef(false)

  const teardown = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current)
      timer.current = null
    }
    stream.current?.getTracks().forEach((track) => track.stop())
    stream.current = null
    void audio.current?.close().catch(() => undefined)
    audio.current = null
    analyser.current = null
    recorder.current = null
    armed.current = false
    setRecording(false)
  }, [])

  const tick = useCallback(() => {
    setDurationMs(Date.now() - startedAt.current)
    const node = analyser.current
    if (!node) return
    const samples = new Float32Array(node.fftSize)
    node.getFloatTimeDomainData(samples)
    const level = levelFromMetering(decibelsOf(samples))
    setLevels((current) => [...current, level].slice(-TRAIL))
  }, [])

  const start = useCallback(async (): Promise<boolean> => {
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices) {
      showErrorMessage("This browser cannot record audio.")
      return false
    }

    setPreparing(true)
    releaseRequested.current = false
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (releaseRequested.current) {
        releaseRequested.current = false
        media.getTracks().forEach((track) => track.stop())
        return false
      }

      const mimeType = pickMimeType((type) =>
        MediaRecorder.isTypeSupported(type)
      )
      const instance = new MediaRecorder(
        media,
        mimeType ? { mimeType } : undefined
      )
      chunks.current = []
      instance.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data)
      }

      const context = new AudioContext()
      const source = context.createMediaStreamSource(media)
      const node = context.createAnalyser()
      node.fftSize = 1024
      source.connect(node)

      stream.current = media
      recorder.current = instance
      audio.current = context
      analyser.current = node
      armed.current = true
      startedAt.current = Date.now()
      setLevels([])
      setDurationMs(0)
      instance.start(250)
      setRecording(true)
      timer.current = window.setInterval(tick, TICK_MS)
      return true
    } catch (error) {
      showErrorMessage(micErrorMessage(error))
      return false
    } finally {
      setPreparing(false)
    }
  }, [tick])

  const finish = useCallback((): Promise<Blob | null> => {
    const instance = recorder.current
    if (!instance) return Promise.resolve(null)
    return new Promise((resolve) => {
      instance.onstop = () => {
        const base = (instance.mimeType || "audio/webm").split(";")[0]
        resolve(
          chunks.current.length > 0
            ? new Blob(chunks.current, { type: base })
            : null
        )
      }
      if (instance.state !== "inactive") instance.stop()
      else instance.onstop?.(new Event("stop"))
    })
  }, [])

  const stop = useCallback(async (): Promise<VoiceDraft | null> => {
    if (!armed.current) {
      releaseRequested.current = true
      return null
    }
    armed.current = false
    const took = Date.now() - startedAt.current
    const blob = await finish()
    teardown()
    if (!blob || took < MIN_TAKE_MS) return null

    return {
      uri: URL.createObjectURL(blob),
      file: blob,
      mimeType: blob.type,
      durationMs: took,
    }
  }, [finish, teardown])

  const cancel = useCallback(async (): Promise<void> => {
    if (!armed.current) {
      releaseRequested.current = true
      return
    }
    armed.current = false
    await finish()
    teardown()
    setLevels([])
  }, [finish, teardown])

  useEffect(() => () => teardown(), [teardown])

  return { recording, preparing, durationMs, levels, start, stop, cancel }
}
