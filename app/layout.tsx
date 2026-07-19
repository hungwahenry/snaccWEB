import type { Metadata } from "next"
import { Geist_Mono, Inter_Tight } from "next/font/google"

import "./globals.css"
import { Providers } from "@/providers"
import { cn } from "@/lib/utils"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: {
    default: "Snacc — What's happening on campus",
    template: "%s · Snacc",
  },
  description:
    "Snacc is the social app for your campus. Share a thought, a photo, or a GIF, and see what everyone is talking about right now.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", interTight.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
