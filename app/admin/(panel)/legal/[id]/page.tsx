import type { Metadata } from "next"
import { LegalEditorScreen } from "@/features/admin/legal/screens/legal-editor-screen"

export const metadata: Metadata = { title: "Legal document" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <LegalEditorScreen id={id} />
}
