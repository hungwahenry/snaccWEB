import { InboxIcon, SendIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { PillTabs, type PillTab } from "@/components/ui/pill-tabs"
import { Spinner } from "@/components/ui/spinner"
import type { RequestsScreenProps } from "../../hooks/requests/use-requests-screen"
import type { RequestBox } from "../../types"
import { RequestDetailSheet } from "./request-detail-sheet"
import { RequestRow } from "./request-row"

const TABS: PillTab<RequestBox>[] = [
  { value: "incoming", label: "For you", icon: InboxIcon },
  { value: "outgoing", label: "By you", icon: SendIcon },
]

export function RequestsPanel({
  box,
  setBox,
  list,
  empty,
  isBusy,
  open,
  sheet,
}: RequestsScreenProps) {
  return (
    <>
      <PillTabs tabs={TABS} value={box} onChange={setBox} divider={false} />

      <div className="px-6 pt-3">
        {list.loading ? (
          <div className="flex justify-center py-10">
            <Spinner className="text-muted-foreground" />
          </div>
        ) : list.failed && list.items.length === 0 ? (
          <div className="py-10">
            <LoadFailed
              title="Could not load your requests"
              onRetry={list.retry}
            />
          </div>
        ) : list.items.length === 0 ? (
          <EmptyState
            icon={box === "incoming" ? InboxIcon : SendIcon}
            title={empty.title}
            description={empty.description}
            className="py-10"
          />
        ) : (
          list.items.map((item) => (
            <RequestRow
              key={item.id}
              request={item}
              box={box}
              busy={isBusy(item.id)}
              onPress={open}
            />
          ))
        )}
        <LoadMore
          onReach={list.loadMore}
          disabled={list.loading || list.loadingMore}
        />
        <ListFooter loading={list.loadingMore} />
      </div>

      <RequestDetailSheet {...sheet} />
    </>
  )
}
