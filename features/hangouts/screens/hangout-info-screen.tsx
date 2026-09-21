"use client"

import {
  FileTextIcon,
  MessageCircleIcon,
  PencilIcon,
  PlusIcon,
  UserRoundPlusIcon,
  UsersIcon,
} from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { BackHeader } from "@/features/navigation/components/back-header"
import { Row, Section, SelectRow } from "@/features/settings/components/rows"
import { badgeCount } from "@/lib/format"
import { HangoutBlockSkeleton } from "../components/block/hangout-block-skeleton"
import { HangoutSummary } from "../components/info/hangout-summary"
import { HangoutUnavailable } from "../components/info/hangout-unavailable"
import { useHangoutInfoScreen } from "../hooks/info/use-hangout-info-screen"

const TITLE = "Hangout info"

export function HangoutInfoScreen({ snaccId }: { snaccId: string }) {
  const screen = useHangoutInfoScreen(snaccId)
  const { info } = screen

  if (screen.state !== "ready") {
    return (
      <>
        <BackHeader title={TITLE} onBack={screen.onBack} />
        <HangoutUnavailable state={screen.state} onRetry={screen.retry} />
      </>
    )
  }

  return (
    <>
      <BackHeader
        title={TITLE}
        onBack={screen.onBack}
        right={
          info?.onEdit ? (
            <IconButton
              icon={PencilIcon}
              label="Edit hangout"
              onClick={info.onEdit}
            />
          ) : undefined
        }
      />

      {info ? (
        <div className="flex flex-col gap-5 p-6">
          <HangoutSummary {...info.summary} />

          {info.membersHref || info.requests ? (
            <Section title="People">
              {info.membersHref ? (
                <SelectRow
                  icon={UsersIcon}
                  label="People going"
                  value={info.going}
                  href={info.membersHref}
                />
              ) : null}
              {info.requests ? (
                <SelectRow
                  icon={UserRoundPlusIcon}
                  label="Requests"
                  value={
                    info.requests.count > 0
                      ? badgeCount(info.requests.count)
                      : "None"
                  }
                  href={info.requests.href}
                />
              ) : null}
            </Section>
          ) : null}

          <Section title="Snaccs">
            <Row
              icon={MessageCircleIcon}
              label="Snaccs from this hangout"
              href={info.snaccsHref}
            />
            {info.postHref ? (
              <Row
                icon={PlusIcon}
                label="Post from this hangout"
                href={info.postHref}
              />
            ) : null}
            <Row
              icon={FileTextIcon}
              label="Open the hangout's snacc"
              href={info.snaccHref}
            />
          </Section>
        </div>
      ) : (
        <div className="p-6">
          <HangoutBlockSkeleton />
        </div>
      )}
    </>
  )
}
