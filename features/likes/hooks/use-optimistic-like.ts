"use client"

import { useOptimistic, useTransition } from "react"
import { withLike, type Likeable } from "../utils/likes"

type OptimisticLike = {
  liked: boolean
  likesCount?: number
  onSet: (liked: boolean) => Promise<void>
}

export function useOptimisticLike({
  liked,
  likesCount = 0,
  onSet,
}: OptimisticLike) {
  const [shown, show] = useOptimistic<Likeable, boolean>(
    { liked, likes_count: likesCount },
    withLike
  )
  const [, startTransition] = useTransition()

  const set = (next: boolean) =>
    startTransition(async () => {
      show(next)
      await onSet(next)
    })

  return {
    liked: shown.liked,
    likesCount: shown.likes_count,
    toggle: () => set(!shown.liked),
    like: () => {
      if (!shown.liked) set(true)
    },
  }
}
