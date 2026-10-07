"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { ANNOUNCEMENTS_PATH } from "@/features/admin/shell/routes"
import { AnnouncementEditor } from "../components/announcement-editor"
import { useAnnouncementEditorScreen } from "../hooks/use-announcement-editor-screen"

export function AnnouncementEditorScreen({ id }: { id: string }) {
  const { query, editor, campuses } = useAnnouncementEditorScreen(id)

  return (
    <>
      <BackLink href={ANNOUNCEMENTS_PATH} label="Back to announcements" />
      <QueryView query={query} what="this announcement">
        {() => <AnnouncementEditor editor={editor} campuses={campuses} />}
      </QueryView>
    </>
  )
}
