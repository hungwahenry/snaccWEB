import type { Metadata } from "next"
import { PageEditorScreen } from "@/features/admin/pages/screens/page-editor-screen"

export const metadata: Metadata = { title: "Edit page" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PageEditorScreen id={id} />
}
