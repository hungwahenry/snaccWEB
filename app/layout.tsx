import type { Metadata } from "next"
import { Geist_Mono, Inter_Tight } from "next/font/google"

import "./globals.css"
import { Providers } from "@/providers"
import { cn } from "@/lib/utils"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

const TITLE = "Snacc — What's happening on campus"
const DESCRIPTION =
  "Snacc is the social app for your campus. Share a thought, a photo, or a GIF, and see what everyone is talking about right now."

export const metadata: Metadata = {
  metadataBase: new URL("https://snacc.fyi"),
  title: { default: TITLE, template: "%s · Snacc" },
  description: DESCRIPTION,
  applicationName: "Snacc",
  keywords: ["Snacc", "campus", "university", "students", "social app", "Nigeria"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Snacc",
    title: TITLE,
    description: DESCRIPTION,
    url: "https://snacc.fyi",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
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
