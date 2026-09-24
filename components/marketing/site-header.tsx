import Link from "next/link"
import { loginPath } from "@/features/auth/routes"
import { DownloadButton } from "./download-button"
import { Wordmark } from "./wordmark"

export function SiteHeader({
  showDownload = true,
}: {
  showDownload?: boolean
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
      <header className="flex items-center justify-between gap-3 rounded-full border border-border bg-background/80 py-2 pr-2 pl-4 shadow-sm backdrop-blur-md sm:pl-5">
        <Wordmark />

        <div className="flex items-center gap-1">
          <Link
            href={loginPath()}
            className="rounded-full px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Log in
          </Link>
          {showDownload ? <DownloadButton label="Get app" /> : null}
        </div>
      </header>
    </div>
  )
}
