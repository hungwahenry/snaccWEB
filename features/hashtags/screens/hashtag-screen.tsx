"use client"

import { HashIcon } from "lucide-react"
import { SnaccListScreen } from "@/features/snaccs/screens/snacc-list-screen"
import { useHashtagSnaccs } from "../hooks/use-hashtag-snaccs"
import { hashtagLabel } from "../utils/labels"

export function HashtagScreen({ tag }: { tag: string }) {
  const list = useHashtagSnaccs(tag)
  const label = hashtagLabel(tag)

  return (
    <SnaccListScreen
      title={label}
      list={list}
      failedTitle="Could not load this tag"
      empty={{
        icon: HashIcon,
        title: "No snaccs yet",
        description: `Nothing tagged ${label} yet.`,
      }}
    />
  )
}
