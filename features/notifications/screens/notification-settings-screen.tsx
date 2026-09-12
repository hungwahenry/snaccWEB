"use client"

import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { NotificationSettingsSkeleton } from "../components/notification-settings-skeleton"
import { PreferenceHeader, PreferenceRow } from "../components/preference-row"
import { useNotificationPreferences } from "../hooks/use-notification-preferences"
import { SECURITY_ALERTS_NOTE } from "../utils/preferences-copy"

export function NotificationSettingsScreen() {
  const back = useBack("/settings")
  const { preferences, loading, failed, retry, toggle } =
    useNotificationPreferences()

  return (
    <>
      <BackHeader title="Notifications" onBack={back} />

      {loading ? (
        <NotificationSettingsSkeleton />
      ) : failed ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load your notification settings"
            onRetry={retry}
          />
        </div>
      ) : (
        <div className="px-6 py-6">
          <PreferenceHeader />
          {preferences.map((preference) => (
            <PreferenceRow
              key={preference.category}
              preference={preference}
              onToggle={toggle}
            />
          ))}
          <p className="pt-4 text-sm text-muted-foreground">
            {SECURITY_ALERTS_NOTE}
          </p>
        </div>
      )}
    </>
  )
}
