import Link from "next/link"
import type { Author } from "@/features/users/types"
import { nameOf } from "@/features/users/utils/names"
import { DOWNLOAD_PATH } from "@/lib/routes"

export function JoinEntry({
  inviter,
  code,
}: {
  inviter: Author
  code: string
}) {
  const name = nameOf(inviter)

  return (
    <div className="flex flex-col gap-8 px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <img src={inviter.avatar_url} alt="" className="size-20 rounded-full" />
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {name} invited you to Snacc 🍿
          </h1>
          <p className="text-base text-muted-foreground">
            The social app for your campus. Join with {name}’s code, stick
            around, and you both get paid.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-3xl border border-border p-5">
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Invite code
        </p>
        <p className="text-4xl font-extrabold tracking-widest text-foreground tabular-nums select-all">
          {code}
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Enter it in Snacc after you sign up. Settings → Invite friends.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={`snacc://join/${code}`}
          className="rounded-2xl bg-foreground px-5 py-3.5 text-center font-semibold text-background transition-transform hover:scale-[1.01]"
        >
          Open in Snacc →
        </a>
        <Link
          href={DOWNLOAD_PATH}
          className="text-center text-sm text-muted-foreground hover:underline"
        >
          Don&rsquo;t have the app? Get Snacc
        </Link>
      </div>
    </div>
  )
}
