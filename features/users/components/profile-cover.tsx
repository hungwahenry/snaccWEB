import { cn } from "@/lib/utils"

/** The banner across the top of a profile: their photo, else a wash of their tier colour. */
export function ProfileCover({
  url,
  tint = null,
  className,
}: {
  url: string | null
  tint?: string | null
  className?: string
}) {
  return (
    <div className={cn("relative h-32 bg-muted sm:h-40", className)}>
      {url ? (
        <img src={url} alt="" className="size-full object-cover" />
      ) : tint ? (
        <div
          className="size-full"
          style={{ backgroundColor: tint, opacity: 0.55 }}
        />
      ) : null}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background" />
    </div>
  )
}
