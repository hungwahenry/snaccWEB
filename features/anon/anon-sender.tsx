"use client"

import { StoreButtons } from "@/components/marketing/store-buttons"
import { cn } from "@/lib/utils"
import type { AnonMessage, AnonRecipient } from "./public"
import { useAnonSender } from "./use-anon-sender"

export function AnonSender({ recipient }: { recipient: AnonRecipient }) {
  const s = useAnonSender(recipient)
  const name = recipient.display_name ?? `@${recipient.username}`

  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <img src={recipient.avatar_url} alt="" className="size-24 rounded-full" />
        <div>
          <h1 className="text-foreground text-2xl font-extrabold tracking-tight text-balance">
            Send {name} an anonymous message
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">They&rsquo;ll never know it&rsquo;s you 👻</p>
        </div>
      </div>

      {!recipient.accepting ? (
        <Notice>{name} isn&rsquo;t accepting anonymous messages right now.</Notice>
      ) : s.restoring ? (
        <div className="bg-muted h-40 animate-pulse rounded-2xl" />
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

          {s.error ? <p className="text-destructive text-center text-sm">{s.error}</p> : null}
        </>
      )}
    </div>
  )
}

function Thread({ messages }: { messages: AnonMessage[] }) {
  return (
    <div className="border-border flex flex-col gap-2 rounded-2xl border p-4">
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
        rows={hasThread ? 2 : 4}
        className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-foreground w-full resize-none rounded-2xl border p-4 text-base outline-none"
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
        <h2 className="text-foreground text-lg font-extrabold">Keep the conversation going</h2>
        <p className="text-muted-foreground mt-1 text-sm text-pretty">
          Get Snacc to keep chatting with {name} anonymously — and know the moment they reply.
        </p>
      </div>
      <StoreButtons />
    </div>
  )
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border text-muted-foreground rounded-2xl border border-dashed p-6 text-center text-sm text-pretty">
      {children}
    </div>
  )
}
