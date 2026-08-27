import Link from "next/link"
import type { PublicProfile } from "@/features/users/public"

export function PayEntry({ profile }: { profile: PublicProfile }) {
  const name = profile.display_name ?? `@${profile.username}`

  return (
    <div className="flex flex-col gap-6 px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <img src={profile.avatar_url} alt="" className="size-20 rounded-full" />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Pay {name} 💸
          </h1>
          <p className="text-base text-muted-foreground">
            @{profile.username} takes money on Snacc — instant and free.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={`snacc://pay?mode=send&to=${profile.username}`}
          className="rounded-2xl bg-foreground px-5 py-3.5 text-center font-semibold text-background transition-transform hover:scale-[1.01]"
        >
          Open in Snacc →
        </a>
        <Link
          href="/download"
          className="text-center text-sm text-muted-foreground hover:underline"
        >
          Don&rsquo;t have the app? Get Snacc
        </Link>
      </div>
    </div>
  )
}
