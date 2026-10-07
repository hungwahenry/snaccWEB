"use client"

import { AnnouncementCard } from "../components/announcement-card"
import { useAnnouncementBanner } from "../hooks/use-announcement-banner"

export function FeedAnnouncement() {
  const { banner, onOpen, onDismiss } = useAnnouncementBanner()
  if (!banner) return null

  return (
    <AnnouncementCard banner={banner} onOpen={onOpen} onDismiss={onDismiss} />
  )
}
