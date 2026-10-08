"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { Trash2, Undo2 } from "lucide-react"
import Link from "next/link"
import { useMemo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StickerImage } from "@/features/admin/shell/components/sticker-image"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import type { Paginated } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import type { HeldSticker } from "../types"
import { heldPackHref, heldPackName } from "../utils/held"

const NOTE = {
  label: "Note",
  placeholder: "Why, for the audit log",
}

function PackName({ pack }: { pack: HeldSticker["pack"] }) {
  const href = heldPackHref(pack)

  return href ? (
    <Link
      href={href}
      className="font-medium underline-offset-4 hover:underline"
    >
      {heldPackName(pack)}
    </Link>
  ) : (
    <span className="font-medium">{heldPackName(pack)}</span>
  )
}

export function HeldStickersTable({
  query,
  filtered,
  toolbar,
  onPageChange,
  onRelease,
  onRemove,
}: {
  query: UseQueryResult<Paginated<HeldSticker>>
  filtered: boolean
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onRelease: (id: string, note?: string) => Promise<unknown>
  onRemove: (id: string, note?: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<HeldSticker>[]>(
    () => [
      {
        id: "sticker",
        header: "Sticker",
        className: "w-28",
        cell: (sticker) => (
          <a href={sticker.url} target="_blank" rel="noreferrer">
            <StickerImage
              src={sticker.url}
              alt="Held sticker"
              className="size-20 p-1"
            />
          </a>
        ),
      },
      {
        id: "pack",
        header: "Pack",
        cell: (sticker) => <PackName pack={sticker.pack} />,
      },
      {
        id: "owner",
        header: "Made by",
        cell: (sticker) => <UserCell user={sticker.owner} />,
      },
      {
        id: "held",
        header: "Held",
        className: "whitespace-nowrap text-muted-foreground",
        cell: (sticker) => formatDate(sticker.held_at),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (sticker) => (
          <div className="flex justify-end gap-1">
            <CanAct permission="stickers.read">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    <Undo2 />
                    Release
                  </Button>
                }
                tone="default"
                title="Release this sticker?"
                description="It's cleared straight away, so its owner can send it and anyone with the pack can use it."
                reason={NOTE}
                confirmLabel="Release it"
                onConfirm={(note) => onRelease(sticker.id, note)}
              />
            </CanAct>
            <CanAct permission="stickers.moderate">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    <Trash2 />
                    Remove
                  </Button>
                }
                title="Remove this sticker everywhere?"
                description="It leaves the pack, and every copy of it is pulled too: in other people's packs and Favourites, and in posts and messages it was already sent in. It can't be undone."
                reason={NOTE}
                confirmLabel="Remove it everywhere"
                onConfirm={(note) => onRemove(sticker.id, note)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [onRelease, onRemove]
  )

  return (
    <QueryTable
      query={query}
      what="held stickers"
      columns={columns}
      rowKey={(sticker) => sticker.id}
      empty={
        filtered
          ? "No held stickers match that."
          : "Nothing is held. New stickers the automatic check isn't sure about wait here."
      }
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
