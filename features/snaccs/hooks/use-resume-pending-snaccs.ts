"use client"

import { useEffect } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { authorFromUser } from "@/features/users/utils/author"
import { resumePendingSnaccs } from "../cache/pending-snaccs"

export function useResumePendingSnaccs() {
  const me = useMe().data
  const ready = !!me?.profile?.completed_at

  useEffect(() => {
    if (me && ready) void resumePendingSnaccs(authorFromUser(me))
  }, [me, ready])
}
