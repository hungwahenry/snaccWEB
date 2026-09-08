"use client"

import { BookmarkIcon } from "lucide-react"
import { SnaccListScreen } from "@/features/snaccs/screens/snacc-list-screen"
import { useSavedSnaccs } from "../hooks/use-saved-snaccs"

export function SavedScreen() {
  const saved = useSavedSnaccs()

  return (
    <SnaccListScreen
      title="Saved"
      list={{ ...saved, snaccs: saved.snaccs.filter((snacc) => snacc.saved) }}
      failedTitle="Could not load your saved snaccs"
      empty={{
        icon: BookmarkIcon,
        title: "Nothing saved yet",
        description:
          "Open the menu on any snacc and choose Save to keep it here.",
      }}
    />
  )
}
