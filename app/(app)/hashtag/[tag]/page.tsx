import type { Metadata } from "next"
import { HashtagScreen } from "@/features/hashtags/screens/hashtag-screen"
import { requireSession } from "@/lib/auth-server"

type Props = { params: Promise<{ tag: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return { title: `#${decodeURIComponent(tag)}` }
}

export default async function HashtagPage({ params }: Props) {
  const { tag } = await params
  await requireSession(`/hashtag/${tag}`)
  return <HashtagScreen tag={decodeURIComponent(tag)} />
}
