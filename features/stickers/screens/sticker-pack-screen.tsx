"use client"

import { EllipsisIcon, PlusIcon, StickerIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { PremiumNudge } from "@/features/premium/components/premium-nudge"
import { ReportSheet } from "@/features/reports/components/report-sheet"
import { PackHero } from "../components/pack-hero"
import { PackMenuSheet } from "../components/pack-menu-sheet"
import { PackTakenDown } from "../components/pack-taken-down"
import { PackTitleSheet } from "../components/pack-title-sheet"
import { StickerCreator } from "../components/sticker-creator"
import { StickerGrid } from "../components/sticker-grid"
import { StickerPackSkeleton } from "../components/sticker-pack-skeleton"
import { useStickerPackScreen } from "../hooks/use-sticker-pack-screen"

export function StickerPackScreen({ id }: { id: string }) {
  const screen = useStickerPackScreen(id)
  const { pack, empty } = screen

  return (
    <>
      <BackHeader
        title={pack?.title ?? "Sticker pack"}
        onBack={screen.onBack}
        right={
          screen.onOpenMenu ? (
            <IconButton
              icon={EllipsisIcon}
              label="Pack options"
              onClick={screen.onOpenMenu}
            />
          ) : undefined
        }
      />

      {!screen.enabled ? null : screen.missing ? (
        <EmptyState
          icon={StickerIcon}
          title="This pack isn't available"
          description="It may have been deleted or taken down."
          className="py-24"
        />
      ) : screen.failed && !pack ? (
        <div className="py-24">
          <LoadFailed title="Could not load this pack" onRetry={screen.retry} />
        </div>
      ) : !pack ? (
        <StickerPackSkeleton />
      ) : (
        <div className="flex flex-col pb-8">
          <PackHero pack={pack}>
            {screen.onAddSticker ? (
              <Button onClick={screen.onAddSticker}>
                <PlusIcon />
                Add a sticker
              </Button>
            ) : null}
            {screen.onToggleSave ? (
              <Button
                variant={
                  pack.saved || screen.onAddSticker ? "outline" : "default"
                }
                disabled={screen.saving}
                onClick={screen.onToggleSave}
              >
                {pack.saved ? "Remove from stickers" : "Add to stickers"}
              </Button>
            ) : null}
          </PackHero>

          {screen.takenDown ? <PackTakenDown /> : null}

          {screen.lockedForMe ? (
            <div className="flex justify-center px-4 pb-4">
              <PremiumNudge
                show
                label="Stickers in this pack come with Premium"
              />
            </div>
          ) : null}

          {screen.tiles.length > 0 ? (
            <StickerGrid tiles={screen.tiles} onAction={screen.onAction} />
          ) : empty ? (
            <EmptyState
              icon={empty.icon}
              title={empty.title}
              description={empty.description}
            />
          ) : null}
        </div>
      )}

      {screen.menuSheet ? <PackMenuSheet {...screen.menuSheet} /> : null}
      <PackTitleSheet {...screen.renameSheet} />
      <ReportSheet {...screen.report} />
      <StickerCreator {...screen.creator} />
    </>
  )
}
