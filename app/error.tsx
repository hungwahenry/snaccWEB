"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Wordmark } from "@/components/marketing/wordmark"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <header className="mx-auto flex w-full max-w-5xl items-center px-6 py-4">
        <Wordmark />
      </header>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            Something went wrong
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-lg leading-relaxed text-pretty text-muted-foreground">
            An unexpected error tripped us up. Try again in a moment.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-2xl bg-foreground px-6 py-3 font-semibold text-background transition-transform hover:scale-[1.02]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-2xl border border-border px-6 py-3 font-semibold transition-colors hover:bg-muted"
          >
            Go home
          </Link>
        </div>
      </main>
    </div>
  )
}
