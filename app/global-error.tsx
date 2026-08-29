"use client"

import "./globals.css"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-balance">
              Something went wrong
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-lg leading-relaxed text-muted-foreground">
              The app hit an unexpected error. Please reload the page.
            </p>
          </div>
          <button
            onClick={reset}
            className="rounded-2xl bg-foreground px-6 py-3 font-semibold text-background"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  )
}
