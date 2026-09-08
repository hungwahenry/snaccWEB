import type { Metadata } from "next"
import { FollowsScreen } from "@/features/follows/screens/follows-screen"
import { requireSession } from "@/lib/auth-server"

type Props = {
  params: Promise<{ username: string }>
  searchParams: Promise<{ tab?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return { title: `@${username}` }
}

export default async function FollowsPage({ params, searchParams }: Props) {
  const { username } = await params
  const { tab } = await searchParams
  await requireSession(`/follows/${username}`)
  return <FollowsScreen username={username} initialTab={tab} />
}
