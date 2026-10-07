import { UserAvatar } from "@/components/ui/user-avatar"
import type { UserScore } from "@/features/score/types"
import { AuthorMeta } from "@/features/snaccs/components/card/author-meta"
import type { UniversityBadge } from "@/features/universities/types"
import { TierName } from "@/features/users/components/flair"
import { AuthorBadges } from "@/features/users/components/public/author-badges"
import { cn } from "@/lib/utils"
import type { PremiumBenefit } from "../types"
import { benefitIcon } from "../utils/icons"

const CHIP_SPOTS = ["top-1 left-3", "right-3 bottom-1"]

export function PremiumPreview({
  active,
  avatarUrl,
  username,
  displayName,
  university,
  score,
  postedAt,
  benefits,
}: {
  active: boolean
  avatarUrl?: string
  username: string | null
  displayName: string | null
  university: UniversityBadge | null
  score: UserScore
  postedAt: string
  benefits: PremiumBenefit[]
}) {
  return (
    <div className="relative flex h-60 items-center justify-center">
      <div className="motion-safe:animate-[premium-float_5s_ease-in-out_infinite]">
        <div className="w-72 -rotate-4 rounded-2xl bg-card p-3 shadow-[0_14px_40px_color-mix(in_oklab,var(--premium)_35%,transparent)]">
          <div className="flex gap-2.5">
            <UserAvatar
              alt={username ?? ""}
              avatarUrl={avatarUrl}
              name={username ?? displayName}
              className="size-10"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex min-w-0 items-center gap-1.5">
                <TierName
                  score={score}
                  name={username}
                  className="font-extrabold text-foreground"
                />
                <AuthorBadges official={false} premium />
                <AuthorMeta
                  university={university}
                  createdAt={postedAt}
                  linkCampus={false}
                />
              </div>
              <p className="text-base leading-6 text-foreground">
                {active
                  ? "gold tick, secured ✨"
                  : "trying the gold tick on for size ✨"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {benefits.slice(0, CHIP_SPOTS.length).map((benefit, index) => {
        const Icon = benefitIcon(benefit.icon)

        return (
          <div
            key={benefit.key}
            aria-hidden
            style={{ animationDelay: `${400 + index * 200}ms` }}
            className={cn(
              "pointer-events-none absolute z-10 flex items-center gap-2 rounded-full border bg-background py-1.5 pr-3.5 pl-1.5 shadow-lg motion-safe:animate-in motion-safe:duration-500 motion-safe:fill-mode-both motion-safe:fade-in motion-safe:slide-in-from-bottom-2",
              CHIP_SPOTS[index]
            )}
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-premium">
              <Icon className="size-3.5 text-white" />
            </span>
            <span className="text-sm font-bold text-foreground">
              {benefit.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
