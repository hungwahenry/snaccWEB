"use client"

import { GhostIcon, type LucideIcon } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Switch } from "@/components/ui/switch"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { useMessageSettings } from "../hooks/use-message-settings"

function ToggleRow({
  icon: Icon,
  label,
  hint,
  value,
  disabled,
  onChange,
}: {
  icon: LucideIcon
  label: string
  hint: string
  value: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 py-3.5">
      <Icon className="size-5 text-muted-foreground" />
      <span className="flex-1">
        <span className="block text-base text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <Switch checked={value} disabled={disabled} onCheckedChange={onChange} />
    </label>
  )
}

export function PrivacySettingsScreen() {
  const back = useBack("/settings")
  const me = useMe()
  const settings = useMessageSettings()
  const messagesEnabled = useFlag("anon_messages")
  const acceptsAnon = me.data?.profile?.allow_anonymous_messages ?? true
  const busy = me.isPending || settings.isPending

  return (
    <>
      <BackHeader title="Privacy" onBack={back} />
      <div className="flex flex-col gap-5 px-6 py-6">
        <section className="flex flex-col gap-1">
          <Eyebrow className="px-1 pb-1">Anonymous messages</Eyebrow>
          {messagesEnabled ? (
            <ToggleRow
              icon={GhostIcon}
              label="Anonymous messages"
              hint="Let people send you anonymous messages"
              value={acceptsAnon}
              disabled={busy}
              onChange={(value) => settings.mutate({ accept: value })}
            />
          ) : null}
        </section>
      </div>
    </>
  )
}
