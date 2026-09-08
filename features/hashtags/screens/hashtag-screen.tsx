"use client"

import { HashIcon } from "lucide-react"
import { SnaccListScreen } from "@/features/snaccs/screens/snacc-list-screen"
import { useHashtagSnaccs } from "../hooks/use-hashtag-snaccs"

export function HashtagScreen({ tag }: { tag: string }) {
  const list = useHashtagSnaccs(tag)

  return (
    <SnaccListScreen
      title={`#${tag}`}
      list={list}
      failedTitle="Could not load this tag"
      empty={{
        icon: HashIcon,
        title: "No snaccs yet",
        description: `Nothing tagged #${tag} yet.`,
      }}
    />
  )
}
