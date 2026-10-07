"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { ANNOUNCEMENTS_PATH } from "@/features/admin/shell/routes"
import { AnnouncementEditor } from "../components/announcement-editor"
import { useNewAnnouncementScreen } from "../hooks/use-new-announcement-screen"

export function NewAnnouncementScreen() {
  const { editor, campuses } = useNewAnnouncementScreen()

  return (
    <>
      <BackLink href={ANNOUNCEMENTS_PATH} label="Back to announcements" />
      <AnnouncementEditor editor={editor} campuses={campuses} />
    </>
  )
}
