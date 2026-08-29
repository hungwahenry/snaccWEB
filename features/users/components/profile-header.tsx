import { compactCount } from "@/lib/format"
import type { PublicProfile } from "../api/public"

function classOf(profile: PublicProfile): string | null {
  if (!profile.graduated) return null
  return profile.graduation_year
    ? `🎓 Class of ${profile.graduation_year}`
    : "🎓 Alumni"
}

export function ProfileHeader({ profile }: { profile: PublicProfile }) {
  const meta = [
    profile.university?.acronym,
    classOf(profile),
    profile.major,
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-3 px-6 pt-6 pb-4">
      <img src={profile.avatar_url} alt="" className="size-20 rounded-full" />

      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {profile.display_name ?? profile.username}
          </h1>
          <p className="text-base text-muted-foreground">@{profile.username}</p>
        </div>

        {profile.bio ? (
          <p className="text-base leading-snug text-foreground">
            {profile.bio}
          </p>
        ) : null}

        {meta.length > 0 ? (
          <p className="text-sm font-semibold text-muted-foreground">
            {meta.join(" · ")}
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
      <span className="text-base font-extrabold text-foreground">
        {compactCount(count)}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
