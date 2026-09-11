import Link from "next/link"
import { Bump } from "@/components/motion/bump"
import { compactCount } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ProfileStat } from "../utils/profile"

export function ProfileStats({ stats }: { stats: ProfileStat[] }) {
  return (
    <div className="flex justify-between">
      {stats.map((stat) => (
        <Stat key={stat.label} stat={stat} />
      ))}
    </div>
  )
}

function Stat({ stat }: { stat: ProfileStat }) {
  const content = (
    <>
      <Bump value={stat.count}>
        <span className="text-base font-extrabold text-foreground">
          {compactCount(stat.count)}
        </span>
      </Bump>
      <span className="text-xs text-muted-foreground">{stat.label}</span>
    </>
  )
  const className = "flex flex-col items-center"

  if (!stat.href) return <div className={className}>{content}</div>

  return (
    <Link
      href={stat.href}
      className={cn(
        className,
        "rounded-xl px-2 transition-opacity hover:opacity-70"
      )}
    >
      {content}
    </Link>
  )
}
