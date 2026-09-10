"use client"

import { BellIcon, BellOffIcon, LockIcon, SendIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { ChatBubble } from "../components/chat-bubble"
import { useChatRoomScreen } from "../hooks/use-chat-room-screen"

export function ChatRoomScreen({ roomId }: { roomId: string }) {
  const screen = useChatRoomScreen(roomId)
  const room = screen.room

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h1 className="text-base font-bold">
            {room?.campus ? room.campus.acronym : "Everyone"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {room?.campus ? room.campus.name : "Everyone on Snacc"}
          </p>
        </div>
        {room ? (
          <button
            type="button"
            aria-label={room.muted ? "Unmute room" : "Mute room"}
            onClick={screen.toggleMuted}
            className="cursor-pointer rounded-full p-2 hover:bg-muted"
          >
            {room.muted ? (
              <BellOffIcon className="size-5" />
            ) : (
              <BellIcon className="size-5" />
            )}
          </button>
        ) : null}
      </header>

      {/* Reversed so the newest sits at the bottom without reordering what the API returned. */}
      <div className="flex flex-1 flex-col-reverse overflow-y-auto py-3">
        {screen.loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : screen.messages.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            description="Be the first to say something."
          />
        ) : (
          screen.messages.map((message, index) => (
            <ChatBubble
              key={message.id}
              message={message}
              leadsRun={
                screen.messages[index + 1]?.sender.id !== message.sender.id
              }
              onRemove={() => screen.remove(message.id)}
            />
          ))
        )}
      </div>

      {screen.typingLabel ? (
        <p className="px-4 pb-1 text-xs italic text-muted-foreground">
          {screen.typingLabel}
        </p>
      ) : null}

      {room?.locked ? (
        <div className="flex items-center justify-center gap-2 border-t border-border px-4 py-4 text-sm text-muted-foreground">
          <LockIcon className="size-4" />
          This room is closed for now.
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            screen.post()
          }}
          className="flex items-end gap-2 border-t border-border px-3 py-2"
        >
          <input
            value={screen.draft}
            onChange={(event) => setDraftFrom(event, screen.setDraft)}
            placeholder="Message the room"
            className="flex-1 rounded-2xl bg-muted px-4 py-2.5 outline-none"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!screen.canSend}
            className="cursor-pointer rounded-full bg-primary p-3 text-primary-foreground disabled:opacity-40"
          >
            <SendIcon className="size-4" />
          </button>
        </form>
      )}
    </div>
  )
}

function setDraftFrom(
  event: React.ChangeEvent<HTMLInputElement>,
  set: (value: string) => void
): void {
  set(event.target.value)
}
