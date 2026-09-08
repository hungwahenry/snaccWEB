"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { Spinner } from "@/components/ui/spinner"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useGhostWindow } from "@/features/ghost/hooks/use-ghost-window"
import { DiscoverRail } from "@/features/search/screens/discover-rail"
import { isUnauthenticated } from "@/lib/api/errors"
import { AppProviders } from "@/providers/app-providers"
import { AppFrame } from "../components/app-frame"
import { BottomTabBar } from "../components/bottom-tab-bar"
import { RightRail } from "../components/right-rail"
import { Sidebar } from "../components/sidebar"
import { useAppNav } from "../hooks/use-app-nav"

// Screens that own the full height of the phone (a chat thread, the composer) take the tab bar's
// place, the way they push it away in the app.
const IMMERSIVE = [/^\/messages\/[^/]+/, /^\/compose/]

function Gate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const me = useMe()

  const signedOut = me.isError && isUnauthenticated(me.error)
  const incomplete = !!me.data && !me.data.profile?.completed_at

  useEffect(() => {
    if (signedOut) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    else if (incomplete) router.replace("/complete-profile")
  }, [signedOut, incomplete, pathname, router])

  if (me.isPending || signedOut || incomplete) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}

function Shell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const nav = useAppNav()
  const logout = useLogout()
  const ghost = useGhostWindow()
  const searchEnabled = useFlag("search")
  const profile = nav.user?.profile
  const immersive = IMMERSIVE.some((pattern) => pattern.test(pathname))

  const openCompose = () => router.push("/compose")

  return (
    <AppFrame
      sidebar={
        <Sidebar
          items={nav.items}
          activeKey={nav.activeKey}
          ghostActive={ghost.active}
          user={
            profile
              ? {
                  avatarUrl: profile.avatar_url,
                  name: profile.display_name,
                  username: profile.username,
                }
              : null
          }
          onCompose={openCompose}
          onSettings={() => router.push("/settings")}
          onLogout={() => logout.mutate()}
        />
      }
      rail={
        <RightRail showSearch={searchEnabled}>
          <DiscoverRail />
        </RightRail>
      }
      tabBar={
        immersive ? null : (
          <BottomTabBar
            items={nav.items}
            activeKey={nav.activeKey}
            ghostActive={ghost.active}
            onCompose={openCompose}
          />
        )
      }
    >
      {children}
    </AppFrame>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <Gate>
      <AppProviders>
        <Shell>{children}</Shell>
      </AppProviders>
    </Gate>
  )
}
