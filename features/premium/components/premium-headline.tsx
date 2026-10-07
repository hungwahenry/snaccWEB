import { UserAvatar } from "@/components/ui/user-avatar"
import { AuthorBadges } from "@/features/users/components/public/author-badges"
import { cn } from "@/lib/utils"

const LINE =
  "pr-1 text-[44px] leading-[44px] font-extrabold tracking-tighter text-foreground"

export function PremiumHeadline({
  active,
  avatarUrl,
  name,
}: {
  active: boolean
  avatarUrl?: string
  name: string | null
}) {
  const lead = active ? "YOU’RE" : "GO"

  return (
    <h1 aria-label={`${lead} Premium`}>
      <span className="flex items-center gap-2">
        <span className={LINE}>{lead}</span>
        <span
          aria-hidden
          className="flex h-10 items-center gap-1 rounded-full bg-premium/20 pr-2.5 pl-1"
        >
          <UserAvatar
            alt=""
            avatarUrl={avatarUrl}
            name={name}
            className="size-8 border-2 border-background"
            textClassName="text-[10px]"
          />
          <AuthorBadges official={false} premium size={22} />
        </span>
      </span>
      <span className={cn("block", LINE)}>PREMIUM</span>
    </h1>
  )
}
