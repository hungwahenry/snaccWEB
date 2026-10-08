"use client"

import { useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { submitMessage } from "@/features/messages/cache/pending-messages"
import { useConversations } from "@/features/messages/hooks/use-conversations"
import { signal } from "@/features/signals/utils/queue"
import { useShareCapture } from "@/hooks/use-share-capture"
import { copyLink, shareOrCopy } from "@/lib/share-links"
import type { ShareSubject } from "../types"
import { labelFor, linkFor, shareable, textFor } from "../utils/subject"
import { showSuccess } from "@/lib/feedback"

export function useShare() {
  const [subject, setSubject] = useState<ShareSubject | null>(null)
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const [note, setNote] = useState("")
  const messagesEnabled = useFlag("anon_messages")
  const conversations = useConversations()
  const capture = useShareCapture("snacc-card.png")

  function noteShare(detail: string) {
    if (subject?.kind === "snacc")
      signal("share", { subjectId: subject.snacc.id, detail })
  }

  function send() {
    if (!subject || picked.length === 0) return
    const link = linkFor(subject)
    const trimmed = note.trim()
    const message = (body: string) => ({ body, images: [], replyingTo: null })

    for (const conversationId of picked) {
      if (trimmed) submitMessage(conversationId, message(trimmed))
      submitMessage(conversationId, message(link))
    }
    noteShare("dm")
    setOpen(false)
    showSuccess("Sent")
  }

  return {
    open(next: ShareSubject) {
      if (!shareable(next)) return
      setSubject(next)
      setPicked([])
      setNote("")
      setOpen(true)
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      subject,
      label: subject ? labelFor(subject) : "",
      canShareNative:
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function",
      onCopyLink: () => {
        if (!subject) return
        noteShare("copy")
        void copyLink(linkFor(subject), `${labelFor(subject)} link`)
        setOpen(false)
      },
      cardRef: capture.cardRef,
      image: {
        busy: capture.busy,
        onShare: () => {
          noteShare("image")
          capture.share()
        },
      },
      onShareLink: () => {
        if (!subject) return
        noteShare("sheet")
        void shareOrCopy(
          linkFor(subject),
          textFor(subject),
          `${labelFor(subject)} link`
        )
        setOpen(false)
      },
      recipients: {
        enabled: messagesEnabled,
        conversations: conversations.conversations,
        loading: conversations.loading,
        picked,
        onToggle: (conversationId: string) =>
          setPicked((current) =>
            current.includes(conversationId)
              ? current.filter((id) => id !== conversationId)
              : [...current, conversationId]
          ),
        note,
        onNote: setNote,
        onSend: send,
      },
    },
  }
}
