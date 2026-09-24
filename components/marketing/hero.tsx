import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { loginPath } from "@/features/auth/routes"
import { HeroCopy } from "./hero-copy"
import { HeroDeck } from "./hero-deck"
import { StoreButtons } from "./store-buttons"

export function Hero({ campuses }: { campuses: number | null }) {
  return (
    <section className="grid items-center gap-10 px-6 pt-12 pb-14 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-6 lg:px-16 lg:py-20">
      <div className="flex flex-col items-start gap-6">
        <HeroCopy campuses={campuses} />

        <div className="flex flex-col gap-4">
          <StoreButtons />
          <Link
            href={loginPath()}
            className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:underline"
          >
            Or continue on web
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>

      <HeroDeck />
    </section>
  )
}
