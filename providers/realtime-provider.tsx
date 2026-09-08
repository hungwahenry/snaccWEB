"use client"

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { io, type Socket } from "socket.io-client"
import { REALTIME_HANDLERS } from "./realtime-handlers"

type Listener = { event: string; handler: (payload: unknown) => void }

type RealtimeApi = {
  subscribe: (room: string) => void
  unsubscribe: (room: string) => void
  on: (event: string, handler: (payload: unknown) => void) => () => void
}

const noop = () => {}
const RealtimeContext = createContext<RealtimeApi>({
  subscribe: noop,
  unsubscribe: noop,
  on: () => noop,
})

export function useRealtime(): RealtimeApi {
  return useContext(RealtimeContext)
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

async function fetchSocketToken(): Promise<string | null> {
  const res = await fetch("/api/session/token", { credentials: "same-origin" })
  if (!res.ok) return null
  const json = (await res.json()) as { data?: { token?: string } }
  return json.data?.token ?? null
}

export function RealtimeProvider({
  enabled,
  children,
}: {
  enabled: boolean
  children: ReactNode
}) {
  const socketRef = useRef<Socket | null>(null)
  const roomsRef = useRef<Map<string, number>>(new Map())
  const listenersRef = useRef<Set<Listener>>(new Set())

  useEffect(() => {
    if (!enabled || !API_URL) return

    let cancelled = false

    void fetchSocketToken().then((token) => {
      if (!token || cancelled) return

      const socket = io(API_URL, { auth: { token }, transports: ["websocket"] })
      socketRef.current = socket

      for (const [event, handler] of Object.entries(REALTIME_HANDLERS)) {
        socket.on(event, handler as (payload: unknown) => void)
      }
      for (const { event, handler } of listenersRef.current)
        socket.on(event, handler)

      socket.on("connect", () => {
        for (const room of roomsRef.current.keys())
          socket.emit("subscribe", room)
      })
    })

    return () => {
      cancelled = true
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [enabled])

  const api = useMemo<RealtimeApi>(
    () => ({
      subscribe: (room) => {
        const rooms = roomsRef.current
        const next = (rooms.get(room) ?? 0) + 1
        rooms.set(room, next)
        if (next === 1) socketRef.current?.emit("subscribe", room)
      },
      unsubscribe: (room) => {
        const rooms = roomsRef.current
        const next = (rooms.get(room) ?? 1) - 1
        if (next <= 0) {
          rooms.delete(room)
          socketRef.current?.emit("unsubscribe", room)
        } else {
          rooms.set(room, next)
        }
      },
      on: (event, handler) => {
        const listener: Listener = { event, handler }
        listenersRef.current.add(listener)
        socketRef.current?.on(event, handler)
        return () => {
          listenersRef.current.delete(listener)
          socketRef.current?.off(event, handler)
        }
      },
    }),
    []
  )

  return (
    <RealtimeContext.Provider value={api}>{children}</RealtimeContext.Provider>
  )
}
