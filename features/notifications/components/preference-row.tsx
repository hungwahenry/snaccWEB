import { Switch } from "@/components/ui/switch"
import type { NotificationPreference } from "../types"

export function PreferenceHeader() {
  return (
    <div className="flex items-center gap-3 pb-2">
      <span className="flex-1" />
      <span className="w-12 text-center text-xs font-bold text-muted-foreground uppercase">
        Push
      </span>
      <span className="w-12 text-center text-xs font-bold text-muted-foreground uppercase">
        Email
      </span>
    </div>
  )
}

export function PreferenceRow({
  preference,
  onToggle,
}: {
  preference: NotificationPreference
  onToggle: (
    preference: NotificationPreference,
    channel: "push" | "email",
    value: boolean
  ) => void
}) {
  return (
    <div className="flex items-center gap-3 py-4">
      <span className="flex-1 text-base text-foreground">
        {preference.label}
      </span>

      <span className="flex w-12 justify-center">
        <Switch
          checked={preference.push}
          disabled={preference.locked}
          onCheckedChange={(value) => onToggle(preference, "push", value)}
          aria-label={`${preference.label} push notifications`}
        />
      </span>
      <span className="flex w-12 justify-center">
        {preference.emailable ? (
          <Switch
            checked={preference.email}
            disabled={preference.locked}
            onCheckedChange={(value) => onToggle(preference, "email", value)}
            aria-label={`${preference.label} emails`}
          />
        ) : null}
      </span>
    </div>
  )
}
