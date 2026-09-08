import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { LoginScreen } from "@/features/auth/screens/login-screen"
import { hasSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Log in" }

type Props = { searchParams: Promise<{ next?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/home"

  if (await hasSession()) redirect(safeNext)

  return <LoginScreen next={safeNext} />
}
