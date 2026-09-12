"use client"

import { CompassIcon, UsersRoundIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BirthdayFab } from "@/features/birthdays/components/birthday-fab"
import { BirthdayNudgeSheet } from "@/features/birthdays/components/birthday-nudge-sheet"
import { BirthdayWishDialog } from "@/features/birthdays/components/birthday-wish-dialog"
import { FirstPostCard } from "@/features/first-post/components/first-post-card"
import { MomentTray } from "@/features/moments/components/moment-tray"
import { MomentTraySkeleton } from "@/features/moments/components/moment-tray-skeleton"
import { AppHeader } from "@/features/navigation/components/app-header"
import { HeaderLink } from "@/features/navigation/components/header-link"
import { SEARCH_PATH } from "@/features/search/routes"
import { SnaccSheets } from "@/features/snaccs/components/sheets/snacc-sheets"
import { SnaccList } from "@/features/snaccs/components/snacc-list"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import { useSnaccTracker } from "@/features/snaccs/hooks/use-snacc-tracker"
import { MoneyFab } from "@/features/wallet/components/money-fab"
import { FeedSortMenu } from "../components/feed-sort-menu"
import { FeedTabs } from "../components/feed-tabs"
import { NewSnaccsPill } from "../components/new-snaccs-pill"
import { useHomeScreen } from "../hooks/use-home-screen"

export function HomeScreen() {
  const screen = useHomeScreen()
  const { handlers, votingPollFor, sheets } = useSnaccActions()
  const tracker = useSnaccTracker()
  const { tabs, list, moments, firstPost } = screen

  return (
    <>
      <AppHeader
        left={
          screen.exploreInHeader ? (
            <HeaderLink href={SEARCH_PATH} icon={CompassIcon} label="Explore" />
          ) : undefined
        }
      />

      {tabs.show ? (
        <FeedTabs
          tabs={tabs.tabs}
          value={tabs.value}
          onChange={tabs.onChange}
          onReselect={tabs.onReselect}
        />
      ) : null}

      {screen.newPill ? <NewSnaccsPill {...screen.newPill} /> : null}

      <SnaccList
        snaccs={list.feed.snaccs}
        loading={list.feed.loading}
        failed={list.feed.failed}
        loadingMore={list.feed.loadingMore}
        onRetry={list.feed.retry}
        onLoadMore={list.feed.loadMore}
        handlers={handlers}
        votingPollFor={votingPollFor}
        itemRef={tracker.ref}
        header={
          <>
            {moments.show ? (
              moments.loading ? (
                <MomentTraySkeleton />
              ) : (
                <MomentTray
                  mine={moments.mine}
                  others={moments.others}
                  onOpen={moments.open}
                  onCompose={moments.compose}
                />
              )
            ) : null}
            {firstPost.show ? (
              <FirstPostCard onPosted={firstPost.markPosted} />
            ) : null}
          </>
        }
        failedTitle={list.failedTitle}
        empty={{
          ...list.empty,
          action: list.findPeople ? (
            <Button
              variant="secondary"
              nativeButton={false}
              render={<Link href={SEARCH_PATH} />}
            >
              <UsersRoundIcon /> Find people
            </Button>
          ) : undefined,
        }}
      />

      <FeedSortMenu {...screen.sortMenu} />
      <SnaccSheets {...sheets} />
      <BirthdayNudgeSheet {...screen.birthdayNudge} />
      <BirthdayWishDialog {...screen.birthdayWish} />
      {screen.moneyFab ? <MoneyFab /> : null}
      {screen.birthdayFab ? <BirthdayFab onPress={screen.birthdayFab} /> : null}
    </>
  )
}
