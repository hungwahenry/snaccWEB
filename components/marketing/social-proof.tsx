import { cn } from "@/lib/utils"
import { campusCountLabel } from "./campus-count"
import { avatar } from "./snacc-deck"

const FACES = ["ada", "tunde", "zainab", "emeka"]

export function SocialProof({ campuses }: { campuses: number | null }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-border bg-background/70 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md">
      <span className="flex">
        {FACES.map((seed, index) => (
          <img
            key={seed}
            src={avatar(seed)}
            alt=""
            className={cn(
              "size-7 rounded-full bg-muted ring-2 ring-background",
              index > 0 && "-ml-2"
            )}
          />
        ))}
      </span>
      {campusCountLabel(campuses)}
    </div>
  )
}
