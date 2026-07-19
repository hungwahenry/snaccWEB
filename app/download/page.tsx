import type { Metadata } from "next"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { StoreButtons } from "@/components/marketing/store-buttons"

export const metadata: Metadata = {
  title: "Download",
  description: "Get Snacc for iOS and Android.",
}

export default function DownloadPage() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader showDownload={false} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-6 py-12 text-center">
        {/* Snacc mark — black on light, white on dark */}
        <img src="/logo-light.png" alt="" className="size-20 dark:hidden" />
        <img src="/logo-dark.png" alt="" className="hidden size-20 dark:block" />

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Get Snacc
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-lg leading-relaxed text-pretty">
            Download the app on your phone and see what your campus is really talking about.
          </p>
        </div>

        <StoreButtons />
      </main>

      <SiteFooter />
    </div>
  )
}
