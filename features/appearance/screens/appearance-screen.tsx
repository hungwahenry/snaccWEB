"use client"

import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useMe } from "@/features/auth/hooks/use-me"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { AccentGrid } from "../components/accent-grid"
import { useAccent } from "../hooks/use-accent"
import { ACCENTS, INK, type Accent } from "../utils/accents"

export function AppearanceScreen() {
  const back = useBack("/settings")
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === "dark" ? "dark" : "light"
  const premium = useMe().data?.profile?.premium ?? false
  const [accent, pick] = useAccent()

  const lockedKeys = new Set(
    premium ? [] : ACCENTS.filter((a) => a.key !== INK.key).map((a) => a.key)
  )

  function choose(next: Accent) {
    if (lockedKeys.has(next.key)) {
      toast("Accent colours are a Premium thing ✨")
      return
    }
    pick(next)
  }

  return (
    <>
      <BackHeader title="Appearance" onBack={back} />

      <div className="flex flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-foreground">
            Accent colour
          </h2>
          <p className="text-sm leading-5 text-muted-foreground">
            The colour Snacc wears in this browser: buttons, send, and
            everything that pops.
          </p>
        </div>

        <AccentGrid
          accents={ACCENTS}
          selectedKey={accent.key}
          lockedKeys={lockedKeys}
          mode={mode}
          onPick={choose}
        />
      </div>
    </>
  )
}
