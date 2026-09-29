import type { NotificationMetrics } from "../types"
import { BreakdownChart } from "./breakdown-chart"
import { ChartFrame } from "./chart-frame"
import { NotificationTypesSection } from "./notifications-sections"

export function NotificationsTab({
  notifications,
}: {
  notifications: NotificationMetrics
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartFrame
          title="Made, pushed and opened"
          description="Notifications in the app, how many also went out as a push, and how many people opened one."
        >
          <BreakdownChart breakdown={notifications.flow} variant="lines" />
        </ChartFrame>
        <ChartFrame
          title="By section"
          description="The same notifications, by the settings section they belong to."
        >
          <BreakdownChart breakdown={notifications.sections} />
        </ChartFrame>
      </div>
      <NotificationTypesSection types={notifications.types} />
    </div>
  )
}
