"use client"

import {
  EllipsisIcon,
  MessageCircleIcon,
  Repeat1Icon,
  RepeatIcon,
  SendIcon,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { UserAvatar } from "@/components/ui/user-avatar"
import { LikeIcon } from "@/features/likes/components/like-icon"
import { profilePath } from "@/features/users/routes"
import { compactCount } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { PlayableClip } from "../../utils/viewer"

export type ClipRailProps = {
  snacc: PlayableClip
  liked: boolean
  likesCount: number
  onToggleLike: () => void
  onComment: () => void
  onResnacc?: () => void
  onShare: () => void
  onMore: () => void
}

const SHADOW = "drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
const RAIL_LIKE_SIZE = 28

function Count({ value }: { value: number }) {
  if (value <= 0) return null
  return (
    <span className={cn("text-xs font-bold text-white", SHADOW)}>
      {compactCount(value)}
    </span>
  )
}

function RailButton({
  icon: Icon,
  label,
  count,
  tinted,
  onPress,
}: {
  icon: LucideIcon
  label: string
  count?: number
  tinted?: boolean
  onPress: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onPress}
        className="flex size-11 cursor-pointer items-center justify-center rounded-full transition active:scale-90"
      >
        <Icon
          className={cn(
            "size-7",
            SHADOW,
            tinted ? "text-primary" : "text-white"
          )}
        />
      </button>
      {count !== undefined ? <Count value={count} /> : null}
    </div>
  )
}

export function ClipRail({
  snacc,
  liked,
  likesCount,
  onToggleLike,
  onComment,
  onResnacc,
  onShare,
  onMore,
}: ClipRailProps) {
  const username = snacc.author.username

  return (
    <div className="flex flex-col items-center gap-4 pb-1">
      <Link
        href={profilePath(username)}
        aria-label={`Open ${username ?? "the author"}`}
      >
        <UserAvatar
          avatarUrl={snacc.author.avatar_url}
          name={username}
          alt={username ?? "Author"}
          className="size-11 border-2 border-white"
        />
      </Link>

      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          aria-label={liked ? "Unlike" : "Like"}
          aria-pressed={liked}
          title={liked ? "Unlike" : "Like"}
          onClick={onToggleLike}
          className={cn(
            "flex size-11 cursor-pointer items-center justify-center rounded-full text-white transition active:scale-90",
            SHADOW
          )}
        >
          <LikeIcon key={snacc.id} liked={liked} size={RAIL_LIKE_SIZE} />
        </button>
        <Count value={likesCount} />
      </div>

      <RailButton
        icon={MessageCircleIcon}
        label="Comments"
        count={snacc.comments_count}
        onPress={onComment}
      />

      {!onResnacc ? null : (
        <RailButton
          icon={snacc.my_resnacc ? Repeat1Icon : RepeatIcon}
          label={snacc.my_resnacc ? "Undo resnacc" : "Resnacc"}
          count={snacc.resnaccs_count}
          tinted={snacc.my_resnacc}
          onPress={onResnacc}
        />
      )}

      <RailButton icon={SendIcon} label="Share" onPress={onShare} />
      <RailButton icon={EllipsisIcon} label="More" onPress={onMore} />
    </div>
  )
}
