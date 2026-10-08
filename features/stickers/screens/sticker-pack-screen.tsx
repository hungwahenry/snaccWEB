"use client"

import { EllipsisIcon, PlusIcon, StickerIcon } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { PremiumNudge } from "@/features/premium/components/premium-nudge"
import { ReportSheet } from "@/features/reports/components/report-sheet"
import { GiphyAdder } from "../components/giphy-adder"
import { PackHero } from "../components/pack-hero"
import { StickerCreator } from "../components/sticker-creator"
import { StickerGrid } from "../components/sticker-grid"
import { StickerMenu } from "../components/sticker-menu"
import { StickerPackSkeleton } from "../components/sticker-pack-skeleton"
import { useStickerPackScreen } from "../hooks/use-sticker-pack-screen"

export function StickerPackScreen({ id }: { id: string }) {
  const screen = useStickerPackScreen(id)
  const { pack } = screen

  return (
    <>
      <BackHeader
        title={pack?.title ?? "Sticker pack"}
        onBack={screen.onBack}
        right={
          screen.menu.length > 0 ? (
            <StickerMenu
              items={screen.menu}
              label="Pack options"
              onSelect={screen.onMenu}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <EllipsisIcon className="size-6" />
            </StickerMenu>
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
      ) : screen.giphy ? (
        <GiphyAdder {...screen.giphy} />
      ) : (
        <div className="flex flex-col pb-8">
          <PackHero
            pack={pack}
            details={screen.details}
            renaming={screen.renaming}
            locked={screen.locked}
          >
            {screen.save || screen.make ? (
              <div className="flex flex-col items-start gap-2">
                {screen.save ? (
                  <Button
                    variant={screen.save.saved ? "outline" : "default"}
                    disabled={screen.save.busy}
                    onClick={screen.save.onToggle}
                    className="self-stretch"
                  >
                    {screen.save.saved
                      ? "In your stickers"
                      : "Add to your stickers"}
                  </Button>
                ) : null}
                {screen.make ? (
                  <StickerMenu
                    items={screen.make.items}
                    label={screen.make.label}
                    onSelect={screen.make.onSelect}
                    className={buttonVariants()}
                  >
                    <PlusIcon />
                    {screen.make.label}
                  </StickerMenu>
                ) : null}
                {screen.full?.show ? (
                  <PremiumNudge show label={screen.full.label} />
                ) : null}
              </div>
            ) : null}
          </PackHero>

          {screen.tiles.length > 0 ? (
            <StickerGrid
              tiles={screen.tiles}
              onPick={screen.onPick}
              onAction={screen.onAction}
            />
          ) : (
            <EmptyState
              icon={StickerIcon}
              title="No stickers yet"
              description={screen.emptyHint}
              compact
            />
          )}
        </div>
      )}

      <ReportSheet {...screen.report} />
      <StickerCreator {...screen.creator} />
    </>
  )
}
