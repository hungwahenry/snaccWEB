"use client"

import { Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { Section } from "@/features/admin/shell/components/detail"
import {
  SettingGroup,
  SettingRow,
} from "@/features/admin/shell/components/setting-row"
import type { StickerPackEditor } from "../hooks/use-sticker-pack-screen"
import type { AdminStickerPackDetail } from "../types"
import {
  featureNote,
  isFeatured,
  packAbilities,
  takeDownNote,
} from "../utils/packs"

export function PeoplePackSettings({
  pack,
  editor,
}: {
  pack: AdminStickerPackDetail
  editor: StickerPackEditor
}) {
  const can = packAbilities(pack)

  return (
    <Section title="Moderation">
      <div className="rounded-lg border">
        <SettingGroup>
          <SettingRow
            label="Feature in the catalog"
            description={featureNote(pack)}
            action={
              <CanAct permission="stickers.write">
                <ActionSwitch
                  checked={isFeatured(pack)}
                  label="Feature in the catalog"
                  disabled={!can.feature}
                  onChange={editor.setFeatured}
                />
              </CanAct>
            }
          />
          <SettingRow
            label="Take down"
            tone="danger"
            description={takeDownNote(pack)}
            action={
              can.takeDown ? (
                <CanAct permission="stickers.moderate">
                  <ConfirmAction
                    trigger={
                      <Button variant="outline" size="sm">
                        <Ban />
                        Take down
                      </Button>
                    }
                    title="Take this pack down?"
                    description="It disappears from the app, along with every sticker anyone has sent from it, sent copies included. It can't be undone."
                    reason={{
                      label: "Note",
                      placeholder: "What was wrong with it, for the audit log",
                    }}
                    confirmLabel="Take it down"
                    onConfirm={editor.takeDown}
                  />
                </CanAct>
              ) : null
            }
          />
        </SettingGroup>
      </div>
    </Section>
  )
}
