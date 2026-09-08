"use client"

import Link from "next/link"
import { Wordmark } from "@/components/marketing/wordmark"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"

export function AboutScreen() {
  const back = useBack("/settings")

  return (
    <>
      <BackHeader title="About" onBack={back} />

      <div className="flex min-h-[60dvh] flex-col px-6">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
          <Wordmark href="/home" height={44} />
          <div className="flex flex-col items-center gap-1">
            <p className="text-2xl font-extrabold tracking-tight text-foreground">
              Snacc
            </p>
            <p className="text-base text-muted-foreground">
              The cherry on top.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-base text-foreground active:opacity-60"
            >
              Terms of Use
            </Link>
            <span className="size-1 rounded-full bg-muted-foreground/40" />
            <Link
              href="/privacy"
              className="text-base text-foreground active:opacity-60"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Snacc
          </p>
        </div>
      </div>
    </>
  )
}
