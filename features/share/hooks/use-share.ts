"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { useFlag } from "@/features/config/hooks/use-flag"
import { sendMessage } from "@/features/messages/api"
import { useConversations } from "@/features/messages/hooks/use-conversations"
import { signal } from "@/features/signals/utils/queue"
import { useShareCapture } from "@/hooks/use-share-capture"
import { getErrorMessage } from "@/lib/api/errors"
import { newId } from "@/lib/ids"
import { copyLink, shareOrCopy } from "@/lib/share-links"
import type { ShareSubject } from "../types"
import { labelFor, linkFor, shareable, textFor } from "../utils/subject"

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

  const sending = useMutation({
    mutationFn: async () => {
      if (!subject) return { sent: 0, failed: 0 }
      const link = linkFor(subject)
      const trimmed = note.trim()

      const results = await Promise.allSettled(
        picked.map(async (conversationId) => {
          if (trimmed)
            await sendMessage(conversationId, { id: newId(), body: trimmed })
          await sendMessage(conversationId, { id: newId(), body: link })
        })
      )
      const failures = results.filter((result) => result.status === "rejected")
      if (failures.length > 0 && failures.length === results.length)
        throw failures[0].reason
      return { sent: results.length - failures.length, failed: failures.length }
    },
    onSuccess: ({ sent, failed }) => {
      if (sent > 0) noteShare("dm")
      if (failed === 0) toast.success("Sent")
      else
        toast(
          `Sent to ${sent}. Couldn't reach ${failed === 1 ? "1 person" : `${failed} people`}`
        )
      setOpen(false)
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

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
        onSend: () => sending.mutate(),
        sending: sending.isPending,
      },
    },
  }
}
