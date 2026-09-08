import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/// The big icon, title and one-liner at the top of an account action screen.
export function SettingsIntro({
  icon: Icon,
  title,
  description,
  tone = "default",
}: {
  icon: LucideIcon
  title: string
  description: string
  tone?: "default" | "destructive"
}) {
  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <div
        className={cn(
          "flex size-16 items-center justify-center rounded-full",
          tone === "destructive" ? "bg-destructive/10" : "bg-muted"
        )}
      >
        <Icon
          className={cn(
            "size-8",
            tone === "destructive" ? "text-destructive" : "text-foreground"
          )}
        />
      </div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="text-center text-base text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export function SettingsBullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
          <span className="flex-1 text-base text-foreground">{item}</span>
        </li>
      ))}
    </ul>
  )
}
