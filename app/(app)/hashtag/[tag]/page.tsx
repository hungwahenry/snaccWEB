import type { Metadata } from "next"
import { hashtagPath } from "@/features/hashtags/routes"
import { HashtagScreen } from "@/features/hashtags/screens/hashtag-screen"
import { hashtagLabel, tagFromParam } from "@/features/hashtags/utils/labels"
import { requireSession } from "@/lib/auth-server"

type Props = { params: Promise<{ tag: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return { title: hashtagLabel(tagFromParam(tag)) }
}

export default async function HashtagPage({ params }: Props) {
  const tag = tagFromParam((await params).tag)
  await requireSession(hashtagPath(tag))
  return <HashtagScreen tag={tag} />
}
