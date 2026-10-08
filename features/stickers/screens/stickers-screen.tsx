"use client"

import { Eyebrow } from "@/components/ui/eyebrow"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { PremiumNudge } from "@/features/premium/components/premium-nudge"
import { PackRow } from "../components/pack-row"
import { PackRowSkeleton } from "../components/pack-row-skeleton"
import { PackTitleField } from "../components/pack-title-field"
import { useStickersScreen } from "../hooks/use-stickers-screen"
import type { HubRow } from "../types"

type StickersScreenState = ReturnType<typeof useStickersScreen>

export function StickersScreen() {
  const screen = useStickersScreen()

  return (
    <>
      <BackHeader title="Stickers" onBack={screen.onBack} />

      {!screen.enabled ? null : screen.failed ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load your stickers"
            onRetry={screen.retry}
          />
        </div>
      ) : screen.loading ? (
        <div className="pt-3">
          <SkeletonRows count={3} item={PackRowSkeleton} />
        </div>
      ) : (
        <div className="flex flex-col pb-8">
          {screen.rows.map((row) => (
            <HubRowView key={row.key} row={row} screen={screen} />
          ))}
          {screen.more ? (
            <>
              <LoadMore
                onReach={screen.more.onReach}
                disabled={screen.more.loading}
              />
              <ListFooter loading={screen.more.loading} />
            </>
          ) : null}
        </div>
      )}
    </>
  )
}

function HubRowView({
  row,
  screen,
}: {
  row: HubRow
  screen: StickersScreenState
}) {
  if (row.kind === "section") {
    return <Eyebrow className="px-4 pt-6 pb-1">{row.title}</Eyebrow>
  }

  if (row.kind === "new") {
    return (
      <div className="flex flex-col gap-2 px-4 py-3">
        <PackTitleField {...screen.newPack} />
        {screen.full.show ? (
          <PremiumNudge show label={screen.full.label} className="self-start" />
        ) : null}
      </div>
    )
  }

  const { pack, action } = row

  return (
    <PackRow
      pack={pack}
      details={row.details}
      action={
        action
          ? {
              ...action,
              busy: screen.saving(pack.id),
              onPress: () => screen.onAction(pack),
            }
          : null
      }
    />
  )
}
