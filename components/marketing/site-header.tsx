import Link from "next/link"
import { DownloadButton } from "./download-button"
import { Wordmark } from "./wordmark"

export function SiteHeader({
  showDownload = true,
}: {
  showDownload?: boolean
}) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-6 py-4">
      <Wordmark />
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Log in
        </Link>
        {showDownload ? <DownloadButton /> : null}
      </div>
    </header>
  )
}
