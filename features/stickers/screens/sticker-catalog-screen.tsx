"use client"

import { StickerIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { useFlag } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { PackRow } from "../components/pack-row"
import { PackRowSkeleton } from "../components/pack-row-skeleton"
import { PackSaveButton } from "../components/pack-save-button"
import { useSaveStickerPack } from "../hooks/use-save-sticker-pack"
import { useStickerCatalog } from "../hooks/use-sticker-packs"
import { MY_STICKER_PACKS_PATH } from "../routes"
import { canSavePack } from "../utils/packs"

export function StickerCatalogScreen() {
  const back = useBack()
  const enabled = useFlag("stickers")
  const catalog = useStickerCatalog(enabled)
  const save = useSaveStickerPack()

  return (
    <>
      <BackHeader
        title="Sticker packs"
        onBack={back}
        right={
          enabled ? (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href={MY_STICKER_PACKS_PATH} />}
            >
              My packs
            </Button>
          ) : undefined
        }
      />

      {!enabled ? null : catalog.failed && catalog.packs.length === 0 ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load sticker packs"
            onRetry={catalog.retry}
          />
        </div>
      ) : catalog.loading ? (
        <SkeletonRows count={8} item={PackRowSkeleton} />
      ) : catalog.packs.length === 0 ? (
        <EmptyState
          icon={StickerIcon}
          title="No packs yet"
          description="New sticker packs show up here. Check back soon."
          className="py-24"
        />
      ) : (
        <>
          {catalog.packs.map((pack) => (
            <PackRow
              key={pack.id}
              pack={pack}
              trailing={
                canSavePack(pack) ? (
                  <PackSaveButton
                    saved={pack.saved}
                    busy={save.isPending(pack.id)}
                    onPress={() => save.toggle(pack)}
                  />
                ) : null
              }
            />
          ))}
          <LoadMore onReach={catalog.loadMore} disabled={catalog.loadingMore} />
          <ListFooter loading={catalog.loadingMore} />
        </>
      )}
    </>
  )
}
