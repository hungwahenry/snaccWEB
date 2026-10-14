"use client"

import { Lock, LockOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { DetailHeader } from "@/features/admin/shell/components/detail"
import { plural } from "@/features/admin/shell/utils/format"
import { formatDate, timeAgo } from "@/lib/format"
import type { AdminRoom } from "../types"
import { KIND_LABELS, roomPlace } from "../utils/rooms"

export function RoomHeader({
  room,
  countryNames,
  onLock,
  onUnlock,
}: {
  room: AdminRoom
  countryNames: ReadonlyMap<string, string>
  onLock: (id: string) => Promise<unknown>
  onUnlock: (id: string) => Promise<unknown>
}) {
  const locked = room.locked_at !== null

  return (
    <DetailHeader
      title={room.name}
      badges={
        <>
          <Badge variant="secondary">{KIND_LABELS[room.kind]}</Badge>
          {locked ? <Badge variant="destructive">Locked</Badge> : null}
        </>
      }
      subtitle={roomPlace(room, countryNames)}
      meta={
        <>
          <span>{plural(room.message_count, "message")}</span>
          {room.last_message_at ? (
            <span>Last message {timeAgo(room.last_message_at)}</span>
          ) : null}
          {locked ? <span>Locked {formatDate(room.locked_at)}</span> : null}
        </>
      }
      actions={
        <CanAct permission="chats.lock">
          <ConfirmAction
            trigger={
              <Button variant="outline" size="sm">
                {locked ? <LockOpen /> : <Lock />}
                {locked ? "Unlock room" : "Lock room"}
              </Button>
            }
            tone={locked ? "default" : "destructive"}
            title={locked ? "Open this room again?" : "Lock this room?"}
            description={
              locked
                ? "People can send messages here again."
                : "Nobody can send messages here until you unlock it. What is already there stays."
            }
            confirmLabel={locked ? "Unlock it" : "Lock it"}
            onConfirm={() => (locked ? onUnlock(room.id) : onLock(room.id))}
          />
        </CanAct>
      }
    />
  )
}
