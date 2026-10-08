"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { ChatThemesTable } from "../components/chat-themes-table"
import { useChatThemesScreen } from "../hooks/use-chat-themes-screen"

export function ChatThemesScreen() {
  const { query, actions } = useChatThemesScreen()

  return (
    <>
      <PageHeader
        title="Chat themes"
        description="The looks people can put on a DM. The colours ship with the app's backend; here you decide which ones the picker offers and which need Premium. Turning one off stops it being offered — chats already wearing it keep it."
      />
      <ChatThemesTable
        query={query}
        onSetEnabled={actions.setEnabled}
        onSetPremium={actions.setPremium}
      />
    </>
  )
}
