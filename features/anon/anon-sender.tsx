"use client"

import { StoreButtons } from "@/components/marketing/store-buttons"
import { cn } from "@/lib/utils"
import type { AnonMessage } from "./public"
import { useAnonSender } from "./use-anon-sender"

export function AnonSendCard({
  username,
  name,
  accepting,
}: {
  username: string
  name: string
  accepting: boolean
}) {
  const s = useAnonSender(username)

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
      ) : s.restoring ? (
        <div className="bg-muted h-28 animate-pulse rounded-2xl" />
      ) : (
        <>
          {s.thread ? <Thread messages={s.thread.messages} /> : null}

          {s.walled ? (
            <Wall name={name} />
          ) : (
            <Composer
              text={s.text}
              onText={s.setText}
              onSend={s.submit}
              canSend={s.canSend}
              sending={s.sending}
              hasThread={!!s.thread}
              remaining={s.thread?.remaining}
            />
          )}

          {s.error ? <p className="text-destructive text-sm">{s.error}</p> : null}
        </>
      )}
    </div>
  )
}

function Thread({ messages }: { messages: AnonMessage[] }) {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "max-w-[15rem] rounded-2xl px-4 py-2 text-[15px] leading-snug",
            message.mine
              ? "bg-foreground text-background self-end rounded-br-md"
              : "bg-muted text-foreground self-start rounded-bl-md",
          )}
        >
          {message.body ?? <span className="italic opacity-60">message removed</span>}
        </div>
      ))}
    </div>
  )
}

function Composer({
  text,
  onText,
  onSend,
  canSend,
  sending,
  hasThread,
  remaining,
}: {
  text: string
  onText: (value: string) => void
  onSend: () => void
  canSend: boolean
  sending: boolean
  hasThread: boolean
  remaining: number | undefined
}) {
  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(event) => onText(event.target.value)}
        placeholder={hasThread ? "Say more…" : "Type something nice (or spicy) 👀"}
        maxLength={2000}
        rows={hasThread ? 2 : 3}
        className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground w-full resize-none rounded-2xl border p-4 text-base outline-none"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        className="bg-foreground text-background rounded-2xl px-5 py-3.5 font-semibold transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
      >
        {sending ? "Sending…" : hasThread ? "Send another 👻" : "Send anonymously 👻"}
      </button>
      {hasThread && typeof remaining === "number" && remaining > 0 ? (
        <p className="text-muted-foreground text-center text-xs">
          {remaining} more on the web · get the app to know when they reply
        </p>
      ) : null}
    </div>
  )
}

function Wall({ name }: { name: string }) {
  return (
    <div className="border-border flex flex-col items-center gap-4 rounded-2xl border border-dashed p-6 text-center">
      <p className="text-3xl">👻</p>
      <div>
        <h3 className="text-foreground text-lg font-extrabold">Keep the conversation going</h3>
        <p className="text-muted-foreground mt-1 text-sm text-pretty">
          Get Snacc to keep chatting with {name} anonymously — and know the moment they reply.
        </p>
      </div>
      <StoreButtons />
    </div>
  )
}
