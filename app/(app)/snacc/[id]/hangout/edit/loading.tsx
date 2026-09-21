"use client"

import { ComposerScreen } from "@/components/ui/composer-screen"
import { HangoutBlockSkeleton } from "@/features/hangouts/components/block/hangout-block-skeleton"
import { ComposerHeader } from "@/features/snaccs/components/composer/composer-header"
import { useBack } from "@/hooks/use-back"

export default function Loading() {
  const back = useBack()

  return (
    <ComposerScreen>
      <ComposerHeader title="Edit hangout" onClose={back} />
      <div className="px-4 pt-4">
        <HangoutBlockSkeleton />
      </div>
    </ComposerScreen>
  )
}
