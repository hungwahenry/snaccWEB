"use client"

import {
  EllipsisIcon,
  GhostIcon,
  MessageCircleIcon,
  Repeat1Icon,
  RepeatIcon,
  SendIcon,
  SmilePlusIcon,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { UserAvatar } from "@/components/ui/user-avatar"
import { ReactionPicker } from "@/features/reactions/components/reaction-picker"
import { profilePath } from "@/features/users/routes"
import { compactCount } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { PlayableClip } from "../../utils/viewer"

export type ClipRailProps = {
  snacc: PlayableClip
  onReact: (emoji: string) => void
  onComment: () => void
  onResnacc: () => void
  onShare: () => void
  onMore: () => void
}

const SHADOW = "drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"

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
  onReact,
  onComment,
  onResnacc,
  onShare,
  onMore,
}: ClipRailProps) {
  const username = snacc.author.username

  return (
    <div className="flex flex-col items-center gap-4 pb-1">
      {snacc.anonymous ? (
        <span className="flex size-11 items-center justify-center rounded-full bg-white/15">
          <GhostIcon className="size-6 text-white" />
        </span>
      ) : (
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
      )}

      <div className="flex flex-col items-center gap-1">
        <ReactionPicker
          mine={snacc.my_reaction}
          onSelect={onReact}
          align="end"
          trigger={
            <span className="flex size-11 cursor-pointer items-center justify-center">
              {snacc.my_reaction ? (
                <span className="text-[28px] leading-9">
                  {snacc.my_reaction}
                </span>
              ) : (
                <SmilePlusIcon className={cn("size-7 text-white", SHADOW)} />
              )}
            </span>
          }
        />
        <Count value={snacc.reactions_count} />
      </div>

      <RailButton
        icon={MessageCircleIcon}
        label="Comments"
        count={snacc.comments_count}
        onPress={onComment}
      />

      {snacc.anonymous ? null : (
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
