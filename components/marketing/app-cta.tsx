import Link from "next/link"
import { StoreButtons } from "./store-buttons"

export function AppCTA({ title, next }: { title: string; next: string }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-background/0 to-background" />
      <div className="relative flex flex-col items-center gap-4 bg-background px-6 pb-10 text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-balance">
          {title}
        </h2>
        <p className="max-w-xs text-pretty text-muted-foreground">
          Log in to react, reply, and see everything happening on your campus.
        </p>

        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="inline-flex items-center rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-transform hover:scale-[1.02]"
        >
          Continue on web
        </Link>

        <p className="pt-2 text-sm text-muted-foreground">Or get the app</p>
        <StoreButtons />
      </div>
    </div>
  )
}
