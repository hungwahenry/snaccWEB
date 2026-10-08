"use client"

import { PlusIcon, StickerIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { useFlag } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { PackRow } from "../components/pack-row"
import { PackRowSkeleton } from "../components/pack-row-skeleton"
import { PackTitleSheet } from "../components/pack-title-sheet"
import { TakenDownChip } from "../components/taken-down-chip"
import { useNewStickerPack } from "../hooks/use-pack-title"
import { useMyStickerPacks } from "../hooks/use-sticker-packs"
import { STICKERS_PATH } from "../routes"

export function MyStickerPacksScreen() {
  const back = useBack(STICKERS_PATH)
  const enabled = useFlag("stickers")
  const packs = useMyStickerPacks(enabled)
  const newPack = useNewStickerPack()

  const newButton = (
    <Button size="sm" onClick={newPack.start}>
      <PlusIcon />
      New pack
    </Button>
  )

  return (
    <>
      <BackHeader
        title="Your packs"
        onBack={back}
        right={enabled ? newButton : undefined}
      />

      {!enabled ? null : packs.isError ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load your packs"
            onRetry={() => void packs.refetch()}
          />
        </div>
      ) : packs.isPending ? (
        <SkeletonRows count={3} item={PackRowSkeleton} />
      ) : packs.data.length === 0 ? (
        <EmptyState
          icon={StickerIcon}
          title="No packs yet"
          description="Make a pack, fill it with your own stickers, and anyone can add it."
          action={newButton}
          className="py-24"
        />
      ) : (
        packs.data.map((pack) => (
          <PackRow
            key={pack.id}
            pack={pack}
            trailing={pack.status === "taken_down" ? <TakenDownChip /> : null}
          />
        ))
      )}

      <PackTitleSheet {...newPack.sheet} />
    </>
  )
}
