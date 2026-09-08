"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useConfirmBlock } from "@/features/blocks/hooks/use-confirm-block"
import { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import { useShare } from "@/features/share/hooks/use-share"
import { copyLink, shareLink } from "@/lib/share-links"
import type { PublicProfile } from "../types"

export function useProfileMenu(profile: PublicProfile | undefined) {
  const router = useRouter()
  const me = useMe()
  const block = useConfirmBlock()
  const report = useReportSheet()
  const share = useShare()
  const [open, setOpen] = useState(false)

  const isMe = !!profile && me.data?.id === profile.id

  function closeThen(action: () => void) {
    return () => {
      setOpen(false)
      if (profile) action()
    }
  }

  return {
    onOpen: () => profile && setOpen(true),
    report: report.sheet,
    shareCard: share.sheet,
    sheet: {
      open,
      onOpenChange: setOpen,
      isMe,
      username: profile?.username ?? null,
      onSettings: closeThen(() => router.push("/settings")),
      onShare: closeThen(
        () => profile && share.open({ kind: "profile", profile })
      ),
      onCopyLink: closeThen(() => {
        if (profile?.username)
          void copyLink(shareLink.profile(profile.username), "Profile link")
      }),
      onReport: closeThen(() => {
        if (profile)
          report.open({
            type: "user",
            id: profile.id,
            username: profile.username,
          })
      }),
      onBlock: closeThen(() => {
        if (profile) block(profile, () => router.push("/home"))
      }),
    },
  }
}
