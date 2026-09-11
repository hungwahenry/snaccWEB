import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { LoginScreen } from "@/features/auth/screens/login-screen"
import { safeNextPath } from "@/features/auth/utils/next-path"
import { hasSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Log in" }

type Props = { searchParams: Promise<{ next?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const next = safeNextPath((await searchParams).next)

  if (await hasSession()) redirect(next)

  return <LoginScreen next={next} />
}
