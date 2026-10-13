import type { Metadata } from "next"
import { UnsubscribeScreen } from "@/features/notifications/screens/unsubscribe-screen"

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return <UnsubscribeScreen token={token ?? ""} />
}
