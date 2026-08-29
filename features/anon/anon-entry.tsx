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
    <div className="flex flex-col gap-4 border-t border-border px-6 py-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground">
          Send {name} an anonymous message 👻
        </h2>
        <p className="text-sm text-muted-foreground">
          They&rsquo;ll never know it&rsquo;s you.
        </p>
      </div>

      {!accepting ? (
        <p className="text-sm text-muted-foreground">
          {name} isn&rsquo;t accepting anonymous messages right now.
        </p>
      ) : s.existingId ? (
        <Link
          href={`/anon/${s.existingId}`}
          className="rounded-2xl bg-foreground px-5 py-3.5 text-center font-semibold text-background transition-transform hover:scale-[1.01]"
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
            className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
          />
          <button
            type="button"
            onClick={s.submit}
            disabled={!s.canSend}
            className="rounded-2xl bg-foreground px-5 py-3.5 font-semibold text-background transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
          >
            {s.sending ? "Sending…" : "Send anonymously 👻"}
          </button>
          {s.error ? (
            <p className="text-sm text-destructive">{s.error}</p>
          ) : null}
        </div>
      )}
    </div>
  )
}
