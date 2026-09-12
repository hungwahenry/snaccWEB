"use client"

import { useSearchParams } from "next/navigation"
import { ComposeScreenSkeleton } from "@/features/snaccs/components/composer/compose-screen-skeleton"
import { COMPOSER_COPY, composerMode } from "@/features/snaccs/utils/composer"
import { useBack } from "@/hooks/use-back"

export default function Loading() {
  const params = useSearchParams()
  const back = useBack()
  const mode = composerMode({
    parentId: params.get("parentId") ?? undefined,
    resnaccOfId: params.get("resnaccOfId") ?? undefined,
  })
  const title = params.get("edit") ? "Edit snacc" : COMPOSER_COPY[mode].title

  return <ComposeScreenSkeleton title={title} onClose={back} />
}
