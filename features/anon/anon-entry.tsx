"use client"

import Link from "next/link"
import { useAnonEntry } from "./use-anon-entry"

export function AnonEntry({
  username,
  name,
  accepting,
}: {
  username: string
  name: string
  accepting: boolean
}) {
  const s = useAnonEntry(username)

  return (
    <div className="border-border flex flex-col gap-4 border-t px-6 py-5">
      <div>
        <h2 className="text-foreground text-lg font-extrabold tracking-tight">
          Send {name} an anonymous message 👻
        </h2>
        <p className="text-muted-foreground text-sm">They&rsquo;ll never know it&rsquo;s you.</p>
      </div>

      {!accepting ? (
        <p className="text-muted-foreground text-sm">
          {name} isn&rsquo;t accepting anonymous messages right now.
        </p>
      ) : s.existingId ? (
        <Link
          href={`/anon/${s.existingId}`}
          className="bg-foreground text-background rounded-2xl px-5 py-3.5 text-center font-semibold transition-transform hover:scale-[1.01]"
        >
          Open your conversation →
        </Link>
      ) : (
        <div className="flex flex-col gap-3">
          <textarea
            value={s.text}
            onChange={(event) => s.setText(event.target.value)}
            placeholder="Type something nice (or spicy) 👀"
            maxLength={2000}
            rows={3}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground w-full resize-none rounded-2xl border p-4 text-base outline-none"
          />
          <button
            type="button"
            onClick={s.submit}
            disabled={!s.canSend}
            className="bg-foreground text-background rounded-2xl px-5 py-3.5 font-semibold transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
          >
            {s.sending ? "Sending…" : "Send anonymously 👻"}
          </button>
          {s.error ? <p className="text-destructive text-sm">{s.error}</p> : null}
        </div>
      )}
    </div>
  )
}
