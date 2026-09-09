"use client"

import {
  BellIcon,
  BellRingIcon,
  HandCoinsIcon,
  SendHorizontalIcon,
} from "lucide-react"
import Link from "next/link"
import { Bump } from "@/components/motion/bump"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { StoryRing } from "@/features/moments/components/moment-ring"
import { VisitorsButton } from "@/features/profile-views/components/visitors-button"
import { ScorePill } from "@/features/score/components/score-pill"
import type { ScoreStanding, ScoreTier } from "@/features/score/types"
import { compactCount } from "@/lib/format"
import { richText } from "@/lib/rich-text"
import { cn } from "@/lib/utils"
import type { MomentRing, PublicProfile } from "../types"
import { OgBadge, TierName } from "./flair"

type ProfileHeaderProps = {
  profile: PublicProfile
  tier: ScoreTier | null
  isMe: boolean
  myStanding: ScoreStanding | null
  showScore: boolean
  visitors: { count: number; loading: boolean } | null
  showMessage: boolean
  showPay: boolean
  onToggleFollow: () => void
  onToggleNotify: () => void
  onMessage: () => void
  onPay: () => void
  onEdit: () => void
  onOpenAvatar: () => void
  ring: MomentRing | null
  onOpenMoments: () => void
  followingHref: string
  followersHref: string
}

export function ProfileHeader({
  profile,
  tier,
  isMe,
  myStanding,
  showScore,
  visitors,
  showMessage,
  showPay,
  onToggleFollow,
  onToggleNotify,
  onMessage,
  onPay,
  onEdit,
  onOpenAvatar,
  ring,
  onOpenMoments,
  followingHref,
  followersHref,
}: ProfileHeaderProps) {
  const classOf = profile.graduated
    ? profile.graduation_year
      ? `🎓 Class of ${profile.graduation_year}`
      : "🎓 Alumni"
    : null
  const meta = [profile.university?.acronym, classOf, profile.major].filter(
    Boolean
  )

  return (
    <div className="flex flex-col">
      <div className="relative h-32 bg-muted sm:h-40">
        {profile.cover_url ? (
          <img
            src={profile.cover_url}
            alt=""
            className="size-full object-cover"
          />
        ) : tier?.color ? (
          <div
            className="size-full"
            style={{ backgroundColor: tier.color, opacity: 0.55 }}
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="relative -mt-10 shrink-0">
            {ring ? (
              <StoryRing ring={ring} color={tier?.color ?? null} />
            ) : null}
            <button
              type="button"
              onClick={ring ? onOpenMoments : onOpenAvatar}
              aria-label={
                ring
                  ? `${profile.display_name ?? profile.username ?? "Their"} moments`
                  : `${profile.display_name ?? profile.username ?? "Their"} profile photo`
              }
              className="block rounded-full ring-4 ring-background transition-opacity active:opacity-80"
            >
              <UserAvatar
                alt={profile.display_name ?? "Avatar"}
                avatarUrl={profile.avatar_url}
                name={profile.username}
                className="size-20"
                textClassName="text-2xl"
              />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            {isMe ? (
              <>
                {visitors ? (
                  <VisitorsButton
                    count={visitors.count}
                    loading={visitors.loading}
                  />
                ) : null}
                <Button variant="outline" onClick={onEdit}>
                  Edit profile
                </Button>
              </>
            ) : (
              <>
                {showPay ? (
                  <IconButton
                    icon={HandCoinsIcon}
                    label={`Send money to ${profile.username}`}
                    onClick={onPay}
                    className="border border-border"
                    iconClassName="size-5"
                  />
                ) : null}
                {showMessage && profile.accepts_anonymous_messages ? (
                  <IconButton
                    icon={SendHorizontalIcon}
                    label="Send anonymous message"
                    onClick={onMessage}
                    className="border border-border"
                    iconClassName="size-5"
                  />
                ) : null}
                {profile.is_following ? (
                  <IconButton
                    icon={profile.notifying ? BellRingIcon : BellIcon}
                    label={
                      profile.notifying
                        ? "Stop notifying me of their posts"
                        : "Notify me when they post"
                    }
                    aria-pressed={profile.notifying}
                    onClick={onToggleNotify}
                    className={cn(
                      "border",
                      profile.notifying
                        ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border-border"
                    )}
                    iconClassName="size-5"
                  />
                ) : null}
                <Button
                  variant={profile.is_following ? "outline" : "default"}
                  onClick={onToggleFollow}
                >
                  <Bump value={profile.is_following}>
                    {profile.is_following
                      ? "Following"
                      : profile.follows_you
                        ? "Follow back"
                        : "Follow"}
                  </Bump>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h1 className="flex min-w-0 items-center gap-1.5 text-2xl font-extrabold tracking-tight text-foreground">
                <TierName
                  score={profile.score}
                  official={profile.official}
                  birthday={profile.is_birthday}
                  name={profile.display_name ?? profile.username}
                  iconSize={22}
                />
              </h1>
              {profile.follows_you ? (
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Follows you
                </span>
              ) : null}
              <OgBadge score={profile.score} />
            </div>
            <p className="text-base text-muted-foreground">
              @{profile.username}
            </p>
          </div>

          {profile.bio ? (
            <p className="text-base leading-5 whitespace-pre-wrap text-foreground">
              {richText(profile.bio)}
            </p>
          ) : null}

          {meta.length > 0 ? (
            <p className="text-sm font-medium text-muted-foreground">
              {meta.join(" · ")}
            </p>
          ) : null}
        </div>

        {isMe && myStanding ? (
          <ScorePill
            tier={myStanding.tier}
            points={myStanding.score}
            href="/score"
          />
        ) : !isMe && showScore ? (
          <ScorePill tier={tier} />
        ) : null}

        <div className="flex justify-between">
          <Stat count={profile.snaccs_count} label="Snaccs" />
          <Stat count={profile.total_views_received} label="Views" />
          <Stat
            count={profile.following_count}
            label="Following"
            href={followingHref}
          />
          <Stat
            count={profile.followers_count}
            label="Followers"
            href={followersHref}
          />
        </div>
      </div>
    </div>
  )
}

function Stat({
  count,
  label,
  href,
}: {
  count: number
  label: string
  href?: string
}) {
  const content = (
    <>
      <Bump value={count}>
        <span className="text-base font-extrabold text-foreground">
          {compactCount(count)}
        </span>
      </Bump>
      <span className="text-xs text-muted-foreground">{label}</span>
    </>
  )
  const className = "flex flex-col items-center"

  if (!href) return <div className={className}>{content}</div>

  return (
    <Link
      href={href}
      className={cn(
        className,
        "rounded-xl px-2 transition-opacity hover:opacity-70"
      )}
    >
      {content}
    </Link>
  )
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex animate-pulse flex-col">
      <div className="h-32 bg-muted sm:h-40" />
      <div className="flex flex-col gap-3 px-4 pb-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="-mt-10 size-20 shrink-0 rounded-full bg-muted ring-4 ring-background" />
          <div className="flex gap-2 pt-2">
            <div className="h-9 w-24 rounded-full bg-muted" />
            <div className="h-9 w-9 rounded-full bg-muted" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-6 w-40 rounded-md bg-muted" />
          <div className="h-4 w-24 rounded-md bg-muted" />
          <div className="h-4 w-64 rounded-md bg-muted" />
        </div>
        <div className="flex justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-9 w-14 rounded-md bg-muted" />
          ))}
        </div>
      </div>
      <div className="flex gap-2 border-b border-border px-4 py-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-20 rounded-full bg-muted" />
        ))}
      </div>
    </div>
  )
}
