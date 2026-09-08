"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { useState, type ReactNode } from "react"
import { ConsoleEgg } from "@/components/console-egg"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { getQueryClient } from "@/lib/query-client"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(getQueryClient)

  return (
    <ThemeProvider>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-center" />
          <ConsoleEgg />
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  )
}
