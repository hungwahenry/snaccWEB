import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { UserAvatar } from "@/components/ui/user-avatar"
import { aspectRatio } from "@/lib/aspect"
import type { Snacc } from "../../types"
import { ThreadConnector } from "../thread/thread-connector"

const THUMB = 56

export function ReplyTo({ snacc }: { snacc: Snacc }) {
  const { author } = snacc

  return (
    <div className="flex gap-3">
      <div className="flex w-12 shrink-0 flex-col items-center">
        {snacc.anonymous ? (
          <GhostAvatar />
        ) : (
          <UserAvatar
            alt={author.display_name ?? "Author"}
            avatarUrl={author.avatar_url}
            name={author.username}
          />
        )}
        <ThreadConnector />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pb-4">
        <span className="truncate font-extrabold text-foreground">
          {snacc.anonymous ? "Ghost" : (author.display_name ?? author.username)}
        </span>
        {snacc.body ? (
          <p className="line-clamp-4 leading-6 whitespace-pre-wrap text-muted-foreground">
            {snacc.body}
          </p>
        ) : null}
        {snacc.gif ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={snacc.gif.url}
            alt="GIF"
            className="self-start rounded-lg object-cover"
            style={{ height: THUMB, aspectRatio: aspectRatio(snacc.gif) }}
          />
        ) : snacc.images.length > 0 ? (
          <div className="flex gap-1.5">
            {snacc.images.slice(0, 4).map((image) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.position}
                src={image.thumb_url ?? image.url}
                alt=""
                className="rounded-lg object-cover"
                style={{ width: THUMB, height: THUMB }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
