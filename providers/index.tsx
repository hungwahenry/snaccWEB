"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Suspense, useState, type ReactNode } from "react"
import { ConsoleEgg } from "@/components/console-egg"
import { NavigationProgress } from "@/components/navigation-progress"
import { ThemeProvider } from "./theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { VoiceNoteHost } from "@/features/voice/containers/voice-note-host"
import { getQueryClient } from "@/lib/query/client"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(getQueryClient)

  return (
    <ThemeProvider>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-center" />
          <VoiceNoteHost />
          <ConsoleEgg />
          <Suspense>
            <NavigationProgress />
          </Suspense>
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  )
}
