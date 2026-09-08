"use client"

import type { ReactNode } from "react"
import { ConfirmHost } from "@/components/ui/confirm"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AccentStyle } from "@/features/appearance/components/accent-style"
import { useFlag } from "@/features/config/hooks/use-flag"
import { LightboxProvider } from "@/providers/lightbox-provider"
import { PinPromptProvider } from "./pin-prompt-provider"
import { RealtimeProvider } from "./realtime-provider"
import { StepUpProvider } from "./step-up-provider"
import { StickerStudioProvider } from "./sticker-studio-provider"
import { TiersProvider } from "./tiers-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  const realtime = useFlag("realtime")

  return (
    <TooltipProvider>
      <RealtimeProvider enabled={realtime}>
        <TiersProvider>
          <LightboxProvider>
            <StepUpProvider>
              <PinPromptProvider>
                <StickerStudioProvider>
                  <AccentStyle />
                  {children}
                  <ConfirmHost />
                </StickerStudioProvider>
              </PinPromptProvider>
            </StepUpProvider>
          </LightboxProvider>
        </TiersProvider>
      </RealtimeProvider>
    </TooltipProvider>
  )
}
