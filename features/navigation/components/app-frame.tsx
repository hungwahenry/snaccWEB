import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/// Three columns on a wide screen, one on a phone: rail, the 600px feed column, and a side rail.
export function AppFrame({
  sidebar,
  rail,
  tabBar,
  children,
}: {
  sidebar: ReactNode
  rail: ReactNode
  tabBar: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex w-full max-w-[1265px] justify-center">
        <aside className="sticky top-0 hidden h-dvh w-[76px] shrink-0 md:block xl:w-[275px]">
          {sidebar}
        </aside>

        <main
          className={cn(
            "min-h-dvh w-full max-w-[600px] min-w-0 md:border-x md:border-border md:pb-0",
            tabBar ? "pb-20" : "pb-0"
          )}
        >
          {children}
        </main>

        <aside className="sticky top-0 hidden h-dvh w-[350px] shrink-0 overflow-y-auto lg:block">
          {rail}
        </aside>
      </div>

      {tabBar}
    </div>
  )
}
