import type { Metadata } from "next"
import { AnnouncementEditorScreen } from "@/features/admin/announcements/screens/announcement-editor-screen"

export const metadata: Metadata = { title: "Announcement" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AnnouncementEditorScreen id={id} />
}
