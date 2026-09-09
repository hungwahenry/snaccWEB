"use client"

import { EggIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { FoundRow, MysteryRow } from "../components/collection-rows"
import { EggsSkeleton } from "../components/eggs-skeleton"
import { useEggCollection } from "../hooks/use-egg-collection"
import { RARITY_LABELS } from "../utils/rarity"

export function EggsScreen() {
  const back = useBack()
  const collection = useEggCollection()
  const data = collection.data

  return (
    <>
      <BackHeader title="Easter eggs" onBack={back} />

      {collection.isPending ? (
        <EggsSkeleton />
      ) : collection.isError || !data ? (
        <LoadFailed
          title="Could not load your eggs"
          onRetry={() => void collection.refetch()}
        />
      ) : (
        <div className="flex flex-col pt-2 pb-6">
          <p className="px-6 pb-2 text-sm text-muted-foreground">
            {data.discovered.length} of {data.total} found. The rest are out
            there.
          </p>

          {/* Eggs are found in the app, so say so rather than leaving a web-only reader puzzled. */}
          <p className="px-6 pb-3 text-xs text-muted-foreground">
            Eggs are found in the Snacc app. This is where they turn up once you
            have them.
          </p>

          {data.discovered.length === 0 ? (
            <EmptyState
              icon={EggIcon}
              title="Nothing found yet"
              description="Eggs hide in highly specific moments. Do something unusual."
              className="py-10"
            />
          ) : (
            data.discovered.map((egg) => <FoundRow key={egg.id} egg={egg} />)
          )}

          {data.undiscovered.length > 0 ? (
            <p className="px-6 pt-6 pb-1 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
              Still hidden
            </p>
          ) : null}
          {data.undiscovered.map((egg) => (
            <MysteryRow key={egg.id} egg={egg} />
          ))}

          <p className="px-6 pt-6 text-center text-xs text-muted-foreground">
            Rarity: {Object.values(RARITY_LABELS).join(" · ")}
          </p>
        </div>
      )}
    </>
  )
}
