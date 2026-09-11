import { cn } from "@/lib/utils"
import { DEFAULT_PROFILE_TAB, PROFILE_TABS } from "../../utils/profile-tabs"

/** A still picture of the profile tabs for a signed-out visitor; signing in makes them work. */
export function PublicProfileTabs() {
  return (
    <div className="border-b border-border" aria-hidden>
      <div className="flex gap-2 overflow-x-auto px-4 py-2">
        {PROFILE_TABS.map((tab) => {
          const active = tab.value === DEFAULT_PROFILE_TAB
          const Icon = tab.icon
          return (
            <div
              key={tab.value}
              className={cn(
                "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5",
                active ? "bg-foreground" : "bg-muted"
              )}
            >
              {Icon ? (
                <Icon
                  size={16}
                  className={
                    active ? "text-background" : "text-muted-foreground"
                  }
                />
              ) : null}
              <span
                className={cn(
                  "text-sm font-extrabold",
                  active ? "text-background" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
