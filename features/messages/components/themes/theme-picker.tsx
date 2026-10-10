"use client"

import { ImagePlusIcon, PaletteIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { BackHeader } from "@/features/navigation/components/back-header"
import { Row, Section } from "@/features/settings/components/rows"
import type { ThemePickerScreen } from "../../hooks/use-theme-picker"
import { ChatThemePreview } from "./chat-theme-preview"
import { ChatThemeSkeleton } from "./chat-theme-skeleton"
import { ThemeRow } from "./theme-row"

export function ThemePicker({
  subtitle,
  screen,
}: {
  subtitle: string
  screen: ThemePickerScreen
}) {
  const { apply, photo } = screen

  return (
    <>
      <BackHeader
        title="Chat theme"
        subtitle={subtitle}
        onBack={screen.onBack}
      />

      {screen.unavailable ? (
        <EmptyState
          icon={PaletteIcon}
          title="Chat themes aren't available"
          description="Check back soon."
          className="py-24"
        />
      ) : screen.failed ? (
        <div className="py-24">
          <LoadFailed title="Could not load themes" onRetry={screen.retry} />
        </div>
      ) : screen.loading ? (
        <ChatThemeSkeleton />
      ) : (
        <div className="flex flex-col gap-6 px-6 py-6">
          <ChatThemePreview
            {...screen.preview}
            className="h-80 rounded-3xl border border-border"
          />

          <Section title="Themes">
            <ThemeRow swatches={screen.presets} />
          </Section>

          {photo ? (
            <Section title="Your photo">
              <ThemeRow swatches={photo.options} />
              <Row
                icon={ImagePlusIcon}
                label={photo.chooseLabel}
                onPress={photo.onChoose}
              />
            </Section>
          ) : null}

          <Button
            size="lg"
            disabled={apply.disabled || apply.busy}
            onClick={apply.onPress}
          >
            {apply.busy ? <Spinner /> : apply.label}
          </Button>
        </div>
      )}
    </>
  )
}
