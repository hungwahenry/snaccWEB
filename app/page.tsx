import { DownloadButton } from "@/components/marketing/download-button"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { SnaccDeck } from "@/components/marketing/snacc-deck"

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader />

      <main className="flex flex-1 flex-col items-center justify-center gap-10 py-10 sm:gap-14 sm:py-14">
        <div className="flex w-full justify-center overflow-hidden py-10">
          <SnaccDeck />
        </div>

        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-balance sm:text-6xl">
            What&apos;s happening on campus?
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty">
            Share a thought, a pic, or a GIF, and see what your campus is really talking about right
            now.
          </p>
          <div className="mt-8 flex justify-center">
            <DownloadButton label="Get the app" className="px-6 py-3 text-base" />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
