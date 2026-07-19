import { DownloadButton } from "./download-button"
import { Wordmark } from "./wordmark"

export function SiteHeader({ showDownload = true }: { showDownload?: boolean }) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-6 py-4">
      <Wordmark />
      {showDownload ? <DownloadButton /> : null}
    </header>
  )
}
