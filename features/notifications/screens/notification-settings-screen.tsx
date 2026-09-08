"use client"

import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { PreferenceHeader, PreferenceRow } from "../components/preference-row"
import { useNotificationPreferences } from "../hooks/use-notification-preferences"

export function NotificationSettingsScreen() {
  const back = useBack("/settings")
  const { preferences, loading, failed, retry, toggle } =
    useNotificationPreferences()

  return (
    <>
      <BackHeader title="Notifications" onBack={back} />

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner className="text-muted-foreground" />
        </div>
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
            Security alerts are always sent, so you never miss activity on your
            account.
          </p>
        </div>
      )}
    </>
  )
}
