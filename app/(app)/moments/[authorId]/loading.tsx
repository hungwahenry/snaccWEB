"use client"

import { MomentPlayerSkeleton } from "@/features/moments/components/moment-player-skeleton"
import { useBack } from "@/hooks/use-back"

export default function Loading() {
  const back = useBack()

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="mx-auto h-full w-full md:max-w-[520px]">
        <MomentPlayerSkeleton onClose={back} />
      </div>
    </div>
  )
}
