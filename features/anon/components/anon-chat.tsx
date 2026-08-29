"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/marketing/site-header"
import { StoreButtons } from "@/components/marketing/store-buttons"
import { cn } from "@/lib/utils"
import type { AnonMessage, AnonThread } from "../api/public"
import { useAnonChat } from "../hooks/use-anon-chat"

const recipientName = (recipient: AnonThread["recipient"]) =>
  recipient.display_name ?? `@${recipient.username}`

export function AnonChat({ conversationId }: { conversationId: string }) {
  const s = useAnonChat(conversationId)

  return (
    <div className="flex min-h-dvh justify-center">
      <div className="flex min-h-dvh w-full max-w-lg flex-col border-x border-border">
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          {s.loading ? (
            <div className="p-6">
              <div className="h-40 animate-pulse rounded-2xl bg-muted" />
            </div>
          ) : !s.thread ? (
            <NotFound />
          ) : (
            <>
              <RecipientBar recipient={s.thread.recipient} />

              <div className="flex flex-1 flex-col gap-2 px-6 py-4">
                {s.thread.messages.map((message) => (
                  <Bubble key={message.id} message={message} />
                ))}
              </div>

              {s.error ? (
                <p className="px-6 pb-2 text-sm text-destructive">{s.error}</p>
              ) : null}

              {s.walled ? (
                <Wall name={recipientName(s.thread.recipient)} />
              ) : (
                <Composer
                  text={s.text}
                  onText={s.setText}
                  onSend={s.submit}
                  canSend={s.canSend}
                  sending={s.sending}
                  remaining={s.thread.remaining}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function RecipientBar({ recipient }: { recipient: AnonThread["recipient"] }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-6 py-4">
      <img src={recipient.avatar_url} alt="" className="size-11 rounded-full" />
      <div>
        <p className="font-extrabold text-foreground">
          {recipientName(recipient)}
        </p>
        <p className="text-xs text-muted-foreground">
          Anonymous chat · they don&rsquo;t know it&rsquo;s you
        </p>
      </div>
    </div>
  )
}

function Bubble({ message }: { message: AnonMessage }) {
  return (
    <div
      className={cn(
        "max-w-[16rem] rounded-2xl px-4 py-2 text-[15px] leading-snug",
        message.mine
          ? "self-end rounded-br-md bg-foreground text-background"
          : "self-start rounded-bl-md bg-muted text-foreground"
      )}
    >
      {message.body ?? (
        <span className="italic opacity-60">message removed</span>
      )}
    </div>
  )
}

function Composer({
  text,
  onText,
  onSend,
  canSend,
  sending,
  remaining,
}: {
  text: string
  onText: (value: string) => void
  onSend: () => void
  canSend: boolean
  sending: boolean
  remaining: number
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-border px-6 py-4">
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(event) => onText(event.target.value)}
          placeholder="Say something…"
          maxLength={2000}
          rows={1}
          className="max-h-32 flex-1 resize-none rounded-2xl border border-border bg-background p-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          className="rounded-2xl bg-foreground px-5 py-3 font-semibold text-background transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
        >
          {sending ? "…" : "Send"}
        </button>
      </div>
      {remaining > 0 ? (
        <p className="text-center text-xs text-muted-foreground">
          {remaining} more on the web · get the app to know when they reply
        </p>
      ) : null}
    </div>
  )
}

function Wall({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-4 border-t border-border px-6 py-6 text-center">
      <h3 className="text-xl font-extrabold tracking-tight text-balance text-foreground">
        Keep the conversation going
      </h3>
      <p className="max-w-xs text-pretty text-muted-foreground">
        Get Snacc to keep chatting with {name} anonymously — and know the moment
        they reply.
      </p>
      <StoreButtons />
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-3xl">👻</p>
      <p className="text-pretty text-muted-foreground">
        This conversation isn&rsquo;t available on this device.
      </p>
      <Link href="/" className="font-semibold text-foreground underline">
        Go to Snacc
      </Link>
    </div>
  )
}
