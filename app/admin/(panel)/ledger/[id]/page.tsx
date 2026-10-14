import type { Metadata } from "next"
import { PostingScreen } from "@/features/admin/wallet/screens/posting-screen"

export const metadata: Metadata = { title: "Posting" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PostingScreen id={id} />
}
