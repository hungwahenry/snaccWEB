import { GhostIcon } from "lucide-react"
import Link from "next/link"
import { newMessagePath } from "@/features/messages/routes"

export function MessageCta({
  id,
  username,
  name,
  accepting,
}: {
  id: string
  username: string
  name: string
  accepting: boolean
}) {
  if (!accepting) return null

  const next = newMessagePath({ id, username })

  return (
    <div className="mx-4 my-3 flex items-center gap-3 rounded-2xl border border-border p-4 sm:mx-6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
        <GhostIcon className="size-5 text-foreground" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-extrabold text-foreground">
          Message {name} anonymously
        </span>
        <span className="block text-sm text-muted-foreground">
          They see a ghost, not you, until you choose to reveal yourself.
        </span>
      </span>
      <Link
        href={`/login?next=${encodeURIComponent(next)}`}
        className="shrink-0 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background transition-transform hover:scale-[1.02]"
      >
        Send
      </Link>
    </div>
  )
}
