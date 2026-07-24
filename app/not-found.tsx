import Link from "next/link"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <p className="text-muted-foreground/40 text-8xl font-extrabold tracking-tighter select-none">
          404
        </p>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            This page doesn&apos;t exist
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-lg leading-relaxed text-pretty">
            The link may be broken, or the snacc, profile, or campus may have been removed.
          </p>
        </div>
        <Link
          href="/"
          className="bg-foreground text-background rounded-2xl px-6 py-3 font-semibold transition-transform hover:scale-[1.02]"
        >
          Back to Snacc
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}
