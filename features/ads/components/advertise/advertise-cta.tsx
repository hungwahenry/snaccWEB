import Link from "next/link"
import { PROMOTIONS_PATH } from "../../routes"

export function AdvertiseCta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="landing-frame flex flex-col items-center gap-6 rounded-[2.5rem] px-6 py-16 text-center sm:px-10 lg:py-24">
        <h2 className="max-w-3xl text-4xl font-black tracking-tighter text-balance uppercase sm:text-6xl">
          Your campus is scrolling.
        </h2>
        <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
          Put your snacc where they&apos;re looking. Set it up in a few minutes
          on the web.
        </p>
        <Link
          href={PROMOTIONS_PATH}
          className="inline-flex items-center rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-transform hover:scale-[1.02]"
        >
          Start promoting
        </Link>
      </div>
    </section>
  )
}
