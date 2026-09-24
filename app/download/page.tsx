import type { Metadata } from "next"
import { DownloadBand } from "@/components/marketing/download-band"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"

export const metadata: Metadata = {
  title: "Download",
  description: "Get Snacc for iOS and Android.",
}

export default function DownloadPage() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader showDownload={false} />

      <main className="flex flex-1 flex-col justify-center py-10">
        <DownloadBand
          title="Get Snacc"
          line="Download the app on your phone and see what your campus is really talking about."
        />
      </main>

      <SiteFooter />
    </div>
  )
}
