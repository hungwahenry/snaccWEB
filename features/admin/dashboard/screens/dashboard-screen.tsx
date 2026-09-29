"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { AudienceTab } from "../components/audience-tab"
import { CampusesTab } from "../components/campuses-tab"
import { ContentTab } from "../components/content-tab"
import { MoneyTab } from "../components/money-tab"
import { NotificationsTab } from "../components/notifications-tab"
import { OverviewTab } from "../components/overview-tab"
import { SafetyTab } from "../components/safety-tab"
import { useDashboardScreen } from "../hooks/use-dashboard-screen"
import { PERIOD_OPTIONS } from "../utils/dashboard"

export function DashboardScreen() {
  const screen = useDashboardScreen()
  const { list, campuses } = screen

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your platform at a glance."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {campuses.length > 1 ? (
              <OptionSelect
                label="Campus"
                allLabel="All campuses"
                value={list.values.campus}
                onChange={(campus) => list.setFilter({ campus })}
                options={campuses}
                className="w-56"
              />
            ) : null}
            <OptionSelect
              label="Period"
              value={list.values.period}
              onChange={(period) => list.setFilter({ period })}
              options={PERIOD_OPTIONS}
            />
          </div>
        }
      />
      <QueryView query={screen.query} what="metrics">
        {(metrics) => (
          <div className="flex flex-col gap-4">
            {screen.note ? (
              <p className="text-sm text-pretty text-muted-foreground">
                {screen.note}
              </p>
            ) : null}

            <Tabs value={screen.tab} onValueChange={screen.setTab}>
              <div className="-mx-1 overflow-x-auto px-1 pb-1">
                <TabsList>
                  {screen.tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="overview" className="pt-4">
                <OverviewTab metrics={metrics} growth={screen.growth} />
              </TabsContent>

              <TabsContent value="audience" className="pt-4">
                <QueryView query={screen.audience} what="the audience">
                  {(audience) => <AudienceTab audience={audience} />}
                </QueryView>
              </TabsContent>

              <TabsContent value="content" className="pt-4">
                <QueryView query={screen.content} what="content">
                  {(content) => (
                    <ContentTab content={content} metrics={metrics} />
                  )}
                </QueryView>
              </TabsContent>

              <TabsContent value="money" className="pt-4">
                <QueryView query={screen.money} what="money">
                  {(money) => (
                    <MoneyTab
                      money={money}
                      campusPicked={list.values.campus !== null}
                    />
                  )}
                </QueryView>
              </TabsContent>

              <TabsContent value="notifications" className="pt-4">
                <QueryView query={screen.notifications} what="notifications">
                  {(notifications) => (
                    <NotificationsTab notifications={notifications} />
                  )}
                </QueryView>
              </TabsContent>

              <TabsContent value="safety" className="pt-4">
                <QueryView query={screen.safety} what="safety">
                  {(safety) => <SafetyTab safety={safety} metrics={metrics} />}
                </QueryView>
              </TabsContent>

              <TabsContent value="campuses" className="pt-4">
                <QueryView query={screen.campusStats} what="campuses">
                  {(stats) => (
                    <CampusesTab campuses={stats.items} days={screen.days} />
                  )}
                </QueryView>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </QueryView>
    </>
  )
}
