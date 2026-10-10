"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import { profilePath } from "@/features/users/routes"
import { handleOf } from "@/features/users/utils/names"
import { useBack } from "@/hooks/use-back"
import { isNotFound } from "@/lib/api/errors"
import {
  chatThemePath,
  conversationPath,
  conversationPhotosPath,
  conversationSearchPath,
} from "../routes"
import { partyName } from "../utils/preview"
import { anonymityNote } from "../utils/safety"
import { useAllChatsTheme } from "./use-all-chats-theme"
import { useConversation } from "./use-conversation"
import { useConversationPhotoViewer } from "./use-conversation-photo-viewer"
import { useConversationSafety } from "./use-conversation-safety"
import { useMuteConversation } from "./use-mute-conversation"

const PREVIEW_PHOTOS = 6

export function useConversationDetailsScreen(id: string) {
  const back = useBack(conversationPath(id))
  const query = useConversation(id)
  const allChats = useAllChatsTheme()
  const conversation = query.data ?? null
  const other = conversation?.other ?? null
  const report = useReportSheet()
  const safety = useConversationSafety(id, conversation, report)
  const setMuted = useMuteConversation(id)
  const viewer = useConversationPhotoViewer(id)
  const themesOn = useFlag("chat_themes")
  const { photos } = viewer

  return {
    onBack: back,
    notAvailable: query.isError && isNotFound(query.error),
    failed: query.isError && !isNotFound(query.error),
    retry: () => void query.refetch(),
    party:
      conversation && other
        ? {
            other,
            name: partyName(conversation),
            handle: handleOf(other),
            note: anonymityNote(conversation),
            streak: conversation.streak,
            profileHref: other.username ? profilePath(other.username) : null,
          }
        : null,
    theme:
      themesOn && conversation
        ? {
            label:
              conversation.theme?.label ?? allChats.theme?.label ?? "Default",
            href: chatThemePath(id),
          }
        : null,
    muted: conversation
      ? { value: conversation.muted, onChange: setMuted }
      : null,
    searchHref: conversationSearchPath(id),
    photos: {
      shown: photos.loading || photos.items.length > 0,
      loading: photos.loading,
      items: photos.items.slice(0, PREVIEW_PHOTOS),
      allHref: conversationPhotosPath(id),
      onOpen: viewer.onOpen,
    },
    safety,
    report: report.sheet,
  }
}
