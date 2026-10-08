"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { Section } from "@/features/admin/shell/components/detail"
import {
  SettingGroup,
  SettingRow,
} from "@/features/admin/shell/components/setting-row"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import type { StickerPackEditor } from "../hooks/use-sticker-pack-screen"
import type { AdminStickerPackDetail, PackAbilities } from "../types"
import {
  catalogNote,
  deleteNote,
  PACK_STATUS,
  packAbilities,
  traysNote,
} from "../utils/packs"
import { PackTitleDialog } from "./pack-title-dialog"

function CatalogAction({
  can,
  editor,
}: {
  can: PackAbilities
  editor: StickerPackEditor
}) {
  if (can.publish) {
    return (
      <CanAct permission="stickers.write">
        <ConfirmAction
          trigger={<Button size="sm">Publish</Button>}
          tone="default"
          disabled={!can.publishReady}
          title="Publish this pack?"
          description="It goes in the catalog straight away, where anyone can add it to their tray."
          confirmLabel="Publish"
          onConfirm={editor.publish}
        />
      </CanAct>
    )
  }
  if (can.unpublish) {
    return (
      <CanAct permission="stickers.write">
        <ConfirmAction
          trigger={
            <Button variant="outline" size="sm">
              Unpublish
            </Button>
          }
          title="Unpublish this pack?"
          description="It leaves the catalog and people's trays until you publish it again, and stops going into new people's trays. Stickers already sent stay where they are."
          confirmLabel="Unpublish"
          onConfirm={editor.unpublish}
        />
      </CanAct>
    )
  }

  return null
}

function TraysAction({
  pack,
  can,
  editor,
}: {
  pack: AdminStickerPackDetail
  can: PackAbilities
  editor: StickerPackEditor
}) {
  if (pack.added_by_default) {
    return (
      <CanAct permission="stickers.write">
        <ConfirmAction
          trigger={
            <Button variant="outline" size="sm">
              Stop adding
            </Button>
          }
          tone="default"
          title="Stop adding it to new people's trays?"
          description="People who join from now on won't get it. Anyone who already has it keeps it."
          confirmLabel="Stop adding"
          onConfirm={() => editor.setDefault(false)}
        />
      </CanAct>
    )
  }

  return (
    <CanAct permission="stickers.write">
      <ConfirmAction
        trigger={
          <Button variant="outline" size="sm">
            Add to every tray
          </Button>
        }
        tone="default"
        disabled={!can.addToTrays}
        title="Put it in everyone's tray?"
        description="It goes into every tray now and into the tray of everyone who joins later. Stopping later won't take it back out of trays it's already in."
        confirmLabel="Add to every tray"
        onConfirm={() => editor.setDefault(true)}
      />
    </CanAct>
  )
}

export function SnaccPackSettings({
  pack,
  editor,
}: {
  pack: AdminStickerPackDetail
  editor: StickerPackEditor
}) {
  const can = packAbilities(pack)

  return (
    <Section title="Pack">
      <div className="rounded-lg border">
        <SettingGroup>
          <SettingRow
            label="Name"
            description={pack.title}
            action={
              <CanAct permission="stickers.write">
                <PackTitleDialog
                  heading="Rename the pack"
                  initial={pack.title}
                  submitLabel="Save"
                  disabled={!can.curate}
                  trigger={
                    <Button variant="outline" size="sm">
                      Rename
                    </Button>
                  }
                  onSubmit={editor.rename}
                />
              </CanAct>
            }
          />
          <SettingRow
            label="Premium"
            description="Only Premium subscribers can send its stickers. Everyone else still sees the pack."
            action={
              <CanAct permission="stickers.write">
                <ActionSwitch
                  checked={pack.premium}
                  label="Premium pack"
                  disabled={!can.curate}
                  onChange={editor.setPremium}
                />
              </CanAct>
            }
          />
          <SettingRow
            label="Catalog"
            state={<StatusBadge status={PACK_STATUS[pack.status]} />}
            description={catalogNote(pack)}
            action={<CatalogAction can={can} editor={editor} />}
          />
          <SettingRow
            label="Every tray"
            description={traysNote(pack)}
            action={<TraysAction pack={pack} can={can} editor={editor} />}
          />
          <SettingRow
            label="Delete"
            tone="danger"
            description={deleteNote(pack)}
            action={
              can.remove ? (
                <CanAct permission="stickers.write">
                  <ConfirmAction
                    trigger={
                      <Button variant="outline" size="sm">
                        <Trash2 />
                        Delete
                      </Button>
                    }
                    title="Delete this pack?"
                    description="It goes for good, stickers and all. This can't be undone."
                    confirmLabel="Delete"
                    onConfirm={editor.remove}
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
