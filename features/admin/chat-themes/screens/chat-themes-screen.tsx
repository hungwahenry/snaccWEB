"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { ChatThemesTable } from "../components/chat-themes-table"
import { ThemeDialog } from "../components/theme-dialog"
import { useChatThemesScreen } from "../hooks/use-chat-themes-screen"

export function ChatThemesScreen() {
  const { query, actions } = useChatThemesScreen()

  return (
    <>
      <PageHeader
        title="Chat themes"
        description="The looks people can put on their DMs. Each person picks their own per chat and only they see it. Add and repaint themes here, choose which the picker offers and which need Premium. Switching one off stops it being offered and chats using it keep it; deleting one puts those chats back on the default look."
        action={
          <CanAct permission="chat_themes.write">
            <ThemeDialog
              trigger={
                <Button size="sm">
                  <Plus />
                  Add theme
                </Button>
              }
              onSubmit={(draft) => actions.save(draft)}
            />
          </CanAct>
        }
      />
      <ChatThemesTable
        query={query}
        onSetEnabled={actions.setEnabled}
        onSetPremium={actions.setPremium}
        onSave={actions.save}
        onDelete={actions.remove}
      />
    </>
  )
}
