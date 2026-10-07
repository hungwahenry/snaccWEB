"use client"

import { AnnouncementSheet } from "../components/announcement-sheet"
import { useAnnouncementSheet } from "../hooks/use-announcement-sheet"

export function AnnouncementHost() {
  const sheet = useAnnouncementSheet()
  return <AnnouncementSheet {...sheet} />
}
