"use client"

import {
  BanIcon,
  BellOffIcon,
  EyeIcon,
  FlagIcon,
  ImagesIcon,
  MessageCircleDashedIcon,
  PaletteIcon,
  SearchIcon,
  Undo2Icon,
  type LucideIcon,
} from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { ReportSheet } from "@/features/reports/components/report-sheet"
import {
  ActionRow,
  Row,
  Section,
  SelectRow,
  ToggleRow,
} from "@/features/settings/components/rows"
import { ConversationDetailsSkeleton } from "../components/details/conversation-details-skeleton"
import { PartyCard } from "../components/details/party-card"
import { PhotoGridSkeleton } from "../components/details/photo-grid-skeleton"
import { PhotoStrip } from "../components/details/photo-strip"
import { useConversationDetailsScreen } from "../hooks/use-conversation-details-screen"
import type { SafetyAction } from "../utils/safety"

const SAFETY: Record<
  SafetyAction,
  { label: string; icon: LucideIcon; destructive?: boolean }
> = {
  reveal: { label: "Reveal yourself", icon: EyeIcon },
  report: { label: "Report", icon: FlagIcon },
  block: { label: "Block", icon: BanIcon, destructive: true },
  unblock: { label: "Unblock", icon: Undo2Icon },
}

const PHOTO_PLACEHOLDERS = 3

export function ConversationDetailsScreen({ id }: { id: string }) {
  const screen = useConversationDetailsScreen(id)
  const { party, photos, safety } = screen

  return (
    <>
      <BackHeader title="Details" onBack={screen.onBack} />

      {screen.notAvailable ? (
        <EmptyState
          icon={MessageCircleDashedIcon}
          title="This conversation isn't available"
          description="It may have been deleted."
          className="py-24"
        />
      ) : screen.failed ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load this conversation"
            onRetry={screen.retry}
          />
        </div>
      ) : !party ? (
        <ConversationDetailsSkeleton />
      ) : (
        <div className="flex flex-col gap-6 px-6 py-6">
          <PartyCard {...party} />

          <Section title="Chat">
            {screen.theme ? (
              <SelectRow
                icon={PaletteIcon}
                label="Theme"
                value={screen.theme.label}
                href={screen.theme.href}
              />
            ) : null}
            {screen.muted ? (
              <ToggleRow
                icon={BellOffIcon}
                label="Mute"
                hint="No notifications from this chat"
                value={screen.muted.value}
                onChange={screen.muted.onChange}
              />
            ) : null}
            <Row
              icon={SearchIcon}
              label="Search in chat"
              href={screen.searchHref}
            />
          </Section>

          {photos.shown ? (
            <Section title="Photos">
              {photos.loading ? (
                <PhotoGridSkeleton count={PHOTO_PLACEHOLDERS} />
              ) : (
                <>
                  <PhotoStrip photos={photos.items} onOpen={photos.onOpen} />
                  <Row
                    icon={ImagesIcon}
                    label="See all photos"
                    href={photos.allHref}
                  />
                </>
              )}
            </Section>
          ) : null}

          {safety.actions.length > 0 ? (
            <Section title="Privacy and safety">
              {safety.actions.map((action) => (
                <ActionRow
                  key={action}
                  icon={SAFETY[action].icon}
                  label={SAFETY[action].label}
                  destructive={SAFETY[action].destructive}
                  onPress={() => safety.onAction(action)}
                />
              ))}
            </Section>
          ) : null}
        </div>
      )}

      <ReportSheet {...screen.report} />
    </>
  )
}
