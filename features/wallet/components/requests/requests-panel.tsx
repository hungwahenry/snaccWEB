"use client"

import { InboxIcon, SendIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadMore } from "@/components/ui/load-more"
import { PillTabs } from "@/components/ui/pill-tabs"
import { Spinner } from "@/components/ui/spinner"
import { useRequestsScreen } from "../../hooks/requests/use-requests-screen"
import type { RequestBox } from "../../utils/requests"
import { RequestDetailSheet } from "./request-detail-sheet"
import { RequestRow } from "./request-row"

const TABS: { value: RequestBox; label: string; icon: typeof InboxIcon }[] = [
  { value: "incoming", label: "For you", icon: InboxIcon },
  { value: "outgoing", label: "By you", icon: SendIcon },
]

export function RequestsPanel() {
  const screen = useRequestsScreen()
  const incoming = screen.box === "incoming"
  const loading = screen.list.loading || screen.list.stale

  return (
    <>
      <PillTabs
        tabs={TABS}
        value={screen.box}
        onChange={screen.setBox}
        divider={false}
      />

      <div className="px-6 pt-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner className="text-muted-foreground" />
          </div>
        ) : screen.list.items.length === 0 ? (
          <EmptyState
            icon={incoming ? InboxIcon : SendIcon}
            title={incoming ? "No requests yet" : "Nothing asked yet"}
            description={
              incoming
                ? "No one is asking you for money."
                : "You have not asked anyone yet."
            }
            className="py-10"
          />
        ) : (
          screen.list.items.map((item) => (
            <RequestRow
              key={item.id}
              request={item}
              box={screen.box}
              busy={screen.busyId === item.id}
              onPress={screen.open}
            />
          ))
        )}
        <LoadMore
          onReach={screen.list.loadMore}
          disabled={loading || screen.list.loadingMore}
        />
        <ListFooter loading={screen.list.loadingMore} />
      </div>

      <RequestDetailSheet
        open={screen.detailOpen}
        onOpenChange={screen.setDetailOpen}
        request={screen.detail}
        box={screen.box}
        busy={!!screen.detail && screen.busyId === screen.detail.id}
        onPay={screen.fromSheet(screen.pay)}
        onDecline={screen.fromSheet(screen.decline)}
        onCancel={screen.fromSheet(screen.cancel)}
      />
    </>
  )
}
