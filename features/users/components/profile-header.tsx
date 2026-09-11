import type { ReactNode } from "react"
import { StoryRing } from "@/features/moments/components/moment-ring"
import { ScorePill } from "@/features/score/components/score-pill"
import type { ScoreTier } from "@/features/score/types"
import { richText } from "@/lib/rich-text"
import type { MomentRing, PublicProfile } from "../types"
import { nameOf } from "../utils/names"
import type { ProfileStat } from "../utils/profile"
import { OgBadge, TierName } from "./flair"
import { PersonAvatar } from "./person-avatar"
import { ProfileCover } from "./profile-cover"
import { ProfileStats } from "./profile-stats"

export interface ScorePillView {
  tier: ScoreTier | null
  points?: number
  href?: string
}

type ProfileHeaderProps = {
  profile: PublicProfile
  tint: string | null
  ring: MomentRing | null
  avatarLabel: string
  meta: string | null
  score: ScorePillView | null
  stats: ProfileStat[]
  actions: ReactNode
  onPressAvatar: () => void
}

export function ProfileHeader({
  profile,
  tint,
  ring,
  avatarLabel,
  meta,
  score,
  stats,
  actions,
  onPressAvatar,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col">
      <ProfileCover url={profile.cover_url} tint={tint} />

      <div className="flex flex-col gap-3 px-4 pb-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="relative -mt-10 shrink-0">
            {ring ? <StoryRing ring={ring} color={tint} /> : null}
            <button
              type="button"
              onClick={onPressAvatar}
              aria-label={avatarLabel}
              className="block rounded-full ring-4 ring-background transition-opacity active:opacity-80"
            >
              <PersonAvatar
                person={profile}
                className="size-20"
                textClassName="text-2xl"
              />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            {actions}
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
                  name={nameOf(profile)}
                  iconSize={22}
                />
              </h1>
              {profile.follows_you ? (
                <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Follows you
                </span>
              ) : null}
              <OgBadge score={profile.score} />
            </div>
            {profile.username ? (
              <p className="text-base text-muted-foreground">
                @{profile.username}
              </p>
            ) : null}
          </div>

          {profile.bio ? (
            <p className="text-base leading-5 whitespace-pre-wrap text-foreground">
              {richText(profile.bio)}
            </p>
          ) : null}

          {meta ? (
            <p className="text-sm font-medium text-muted-foreground">{meta}</p>
          ) : null}
        </div>

        {score ? (
          <ScorePill
            tier={score.tier}
            points={score.points}
            href={score.href}
          />
        ) : null}

        <ProfileStats stats={stats} />
      </div>
    </div>
  )
}
