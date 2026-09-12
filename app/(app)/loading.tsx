"use client"

import { CompassIcon } from "lucide-react"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { FeedTabs } from "@/features/feed/components/feed-tabs"
import { useFeedTabs } from "@/features/feed/hooks/use-feed-tabs"
import { useHomeChrome } from "@/features/feed/hooks/use-home-chrome"
import { DEFAULT_FEED_SCOPE } from "@/features/feed/utils/scopes"
import { MomentTraySkeleton } from "@/features/moments/components/moment-tray-skeleton"
import { AppHeader } from "@/features/navigation/components/app-header"
import { HeaderLink } from "@/features/navigation/components/header-link"
import { SEARCH_PATH } from "@/features/search/routes"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"
import { MoneyFab } from "@/features/wallet/components/money-fab"

const ignore = () => {}

export default function Loading() {
  const feed = useFeedTabs()
  const chrome = useHomeChrome()

  return (
    <>
      <AppHeader
        left={
          chrome.exploreInHeader ? (
            <HeaderLink href={SEARCH_PATH} icon={CompassIcon} label="Explore" />
          ) : undefined
        }
      />
      {feed.show ? (
        <FeedTabs
          tabs={feed.tabs}
          value={DEFAULT_FEED_SCOPE}
          onChange={ignore}
          onReselect={feed.sortable ? ignore : undefined}
        />
      ) : null}
      {chrome.moments ? <MomentTraySkeleton /> : null}
      <SkeletonRows count={6} item={SnaccCardSkeleton} />
      {chrome.moneyFab ? <MoneyFab /> : null}
    </>
  )
}
