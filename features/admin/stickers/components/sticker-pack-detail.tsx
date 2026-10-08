"use client"

import { DetailHeader } from "@/features/admin/shell/components/detail"
import { StickerImage } from "@/features/admin/shell/components/sticker-image"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { plural } from "@/features/admin/shell/utils/format"
import { formatDate } from "@/lib/format"
import type { StickerPackEditor } from "../hooks/use-sticker-pack-screen"
import type { AdminStickerPackDetail } from "../types"
import { packAbilities, packBadges } from "../utils/packs"
import { PackBadges } from "./pack-badges"
import { PackStickers } from "./pack-stickers"
import { PeoplePackSettings } from "./people-pack-settings"
import { SnaccPackSettings } from "./snacc-pack-settings"

export function StickerPackDetail({
  pack,
  editor,
}: {
  pack: AdminStickerPackDetail
  editor: StickerPackEditor
}) {
  const can = packAbilities(pack)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        leading={
          <StickerImage
            src={pack.cover?.url ?? null}
            alt=""
            className="size-16 p-1.5"
          />
        }
        title={pack.title}
        badges={<PackBadges badges={packBadges(pack)} />}
        meta={
          <>
            {pack.owner ? (
              <UserCell user={pack.owner} size="sm" />
            ) : (
              <span>Made by Snacc</span>
            )}
            <span>Started {formatDate(pack.created_at)}</span>
            <span>{plural(pack.saves_count, "save")}</span>
            {pack.open_reports > 0 ? (
              <span className="text-destructive">
                {plural(pack.open_reports, "open report")}
              </span>
            ) : null}
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <PackStickers
          groups={editor.groups}
          curate={can.curate}
          progress={editor.uploads.progress}
          onUpload={editor.uploads.upload}
          onRemove={editor.removeSticker}
        />
        <div className="min-w-0 lg:sticky lg:top-6">
          {pack.owner ? (
            <PeoplePackSettings pack={pack} editor={editor} />
          ) : (
            <SnaccPackSettings pack={pack} editor={editor} />
          )}
        </div>
      </div>
    </div>
  )
}
