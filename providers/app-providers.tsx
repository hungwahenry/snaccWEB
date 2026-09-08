"use client"

import type { ReactNode } from "react"
import { ConfirmHost } from "@/components/ui/confirm"
import { TooltipProvider } from "@/components/ui/tooltip"
import { LightboxProvider } from "@/providers/lightbox-provider"
import { useFlag } from "@/features/config/hooks/use-flag"
import { RealtimeProvider } from "./realtime-provider"
import { TiersProvider } from "./tiers-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  const realtime = useFlag("realtime")

  return (
    <TooltipProvider>
      <RealtimeProvider enabled={realtime}>
        <TiersProvider>
          <LightboxProvider>
            {children}
            <ConfirmHost />
          </LightboxProvider>
        </TiersProvider>
      </RealtimeProvider>
    </TooltipProvider>
  )
}
