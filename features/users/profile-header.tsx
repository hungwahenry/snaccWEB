import { compactCount } from "@/lib/format"
import type { PublicProfile } from "./public"

export function ProfileHeader({ profile }: { profile: PublicProfile }) {
  return (
    <div className="flex flex-col gap-3 px-6 pt-6 pb-4">
      <img src={profile.avatar_url} alt="" className="size-20 rounded-full" />

      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
            {profile.display_name ?? profile.username}
          </h1>
          <p className="text-muted-foreground text-base">@{profile.username}</p>
        </div>

        {profile.bio ? (
          <p className="text-foreground text-base leading-snug">{profile.bio}</p>
        ) : null}

        {profile.university ? (
          <p className="text-muted-foreground text-sm font-semibold">
            {profile.university.acronym}
            {profile.major ? ` · ${profile.major}` : ""}
          </p>
        ) : null}
      </div>

      <div className="flex justify-between">
        <Stat count={profile.snaccs_count} label="Snaccs" />
        <Stat count={profile.total_views_received} label="Views" />
        <Stat count={profile.following_count} label="Following" />
        <Stat count={profile.followers_count} label="Followers" />
      </div>
    </div>
  )
}

function Stat({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-foreground text-base font-extrabold">{compactCount(count)}</span>
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  )
}
