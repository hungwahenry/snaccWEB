import { richText } from "@/lib/rich-text"
import type { PublicProfile } from "../../types"
import { nameOf } from "../../utils/names"
import type { ProfileStat } from "../../utils/profile"
import { PersonAvatar } from "../person-avatar"
import { ProfileCover } from "../profile-cover"
import { ProfileStats } from "../profile-stats"
import { AuthorBadges } from "./author-badges"

/** The signed-out view of a profile: who they are and their counts, with nothing to press. */
export function PublicProfileHeader({
  profile,
  meta,
  stats,
}: {
  profile: PublicProfile
  meta: string | null
  stats: ProfileStat[]
}) {
  return (
    <div className="flex flex-col">
      <ProfileCover url={profile.cover_url} />

      <div className="flex flex-col gap-3 px-6 pb-4">
        <PersonAvatar
          person={profile}
          className="-mt-10 size-20 ring-4 ring-background"
          textClassName="text-2xl"
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col gap-0.5">
            <h1 className="flex items-center gap-1.5 text-2xl font-extrabold tracking-tight text-foreground">
              {nameOf(profile)}
              <AuthorBadges
                official={profile.official}
                premium={profile.premium}
                size={20}
              />
            </h1>
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

        <ProfileStats stats={stats} />
      </div>
    </div>
  )
}
