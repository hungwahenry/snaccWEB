import { Mark } from "@/components/marketing/mark"
import { sameOriginMedia } from "@/lib/media-url"
import type { PublicProfile } from "../../types"
import { nameOf } from "../../utils/names"
import { handleWithCampus, profileStats } from "../../utils/profile"
import { TierName } from "../flair"
import { PersonAvatar } from "../person-avatar"
import { ProfileStats } from "../profile-stats"

export const PROFILE_CARD_WIDTH = 340

export function ProfileShareCard({ profile }: { profile: PublicProfile }) {
  return (
    <div
      style={{ width: PROFILE_CARD_WIDTH }}
      className="flex flex-col gap-5 border border-border bg-background p-6"
    >
      <div className="flex flex-col items-center gap-3">
        <PersonAvatar
          person={{
            ...profile,
            avatar_url: sameOriginMedia(profile.avatar_url),
          }}
          className="size-20"
          textClassName="text-2xl"
        />
        <div className="flex flex-col items-center gap-0.5">
          <span className="flex items-center gap-1.5">
            <TierName
              score={profile.score}
              official={profile.official}
              birthday={profile.is_birthday}
              name={nameOf(profile)}
              className="text-xl font-extrabold text-foreground"
              iconSize={20}
            />
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {handleWithCampus(profile)}
          </span>
        </div>
        {profile.bio ? (
          <p className="line-clamp-3 text-center text-sm leading-5 text-foreground">
            {profile.bio}
          </p>
        ) : null}
      </div>

      <ProfileStats stats={profileStats(profile)} />

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Find me on Snacc</span>
        <Mark />
      </div>
    </div>
  )
}
