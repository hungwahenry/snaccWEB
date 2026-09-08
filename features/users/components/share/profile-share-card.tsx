import { Mark } from "@/components/marketing/mark"
import { UserAvatar } from "@/components/ui/user-avatar"
import { compactCount } from "@/lib/format"
import { sameOriginMedia } from "@/lib/media-url"
import type { PublicProfile } from "../../types"
import { TierName } from "../flair"

export const PROFILE_CARD_WIDTH = 340

export function ProfileShareCard({ profile }: { profile: PublicProfile }) {
  return (
    <div
      style={{ width: PROFILE_CARD_WIDTH }}
      className="flex flex-col gap-5 border border-border bg-background p-6"
    >
      <div className="flex flex-col items-center gap-3">
        <UserAvatar
          alt={profile.display_name ?? "Avatar"}
          className="size-20"
          avatarUrl={sameOriginMedia(profile.avatar_url)}
          name={profile.username}
          textClassName="text-2xl"
        />
        <div className="flex flex-col items-center gap-0.5">
          <span className="flex items-center gap-1.5">
            <TierName
              score={profile.score}
              official={profile.official}
              birthday={profile.is_birthday}
              name={profile.display_name ?? profile.username}
              className="text-xl font-extrabold text-foreground"
              iconSize={20}
            />
          </span>
          <span className="truncate text-sm text-muted-foreground">
            @{profile.username}
            {profile.university ? ` · ${profile.university.acronym}` : ""}
          </span>
        </div>
        {profile.bio ? (
          <p className="line-clamp-3 text-center text-sm leading-5 text-foreground">
            {profile.bio}
          </p>
        ) : null}
      </div>

      <div className="flex justify-between">
        <Stat count={profile.snaccs_count} label="Snaccs" />
        <Stat count={profile.total_views_received} label="Views" />
        <Stat count={profile.following_count} label="Following" />
        <Stat count={profile.followers_count} label="Followers" />
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Find me on Snacc</span>
        <Mark />
      </div>
    </div>
  )
}

function Stat({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-base font-extrabold text-foreground">
        {compactCount(count)}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
