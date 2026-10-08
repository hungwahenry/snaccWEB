import type { ReactNode } from "react"
import { PremiumNudge } from "@/features/premium/components/premium-nudge"
import type { PackTitleField as PackTitleFieldProps } from "../hooks/use-pack-title"
import type { StickerPack } from "../types"
import { coverUrlOf } from "../utils/packs"
import { PackCover } from "./pack-cover"
import { PackTakenDown } from "./pack-taken-down"
import { PackTitleField } from "./pack-title-field"

export function PackHero({
  pack,
  details,
  renaming,
  locked,
  children,
}: {
  pack: StickerPack
  details: string
  renaming: PackTitleFieldProps | null
  locked: boolean
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-5">
      <div className="flex items-center gap-4">
        <PackCover
          url={coverUrlOf(pack)}
          className="size-20 shrink-0 rounded-3xl"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {renaming ? (
            <PackTitleField {...renaming} />
          ) : (
            <h2 className="line-clamp-2 text-xl font-extrabold tracking-tight break-words text-foreground">
              {pack.title}
            </h2>
          )}
          <p className="truncate text-sm text-muted-foreground">{details}</p>
          {locked ? (
            <PremiumNudge
              show
              label="Send these with Premium"
              className="mt-1 self-start"
            />
          ) : null}
        </div>
      </div>
      {pack.status === "taken_down" ? <PackTakenDown /> : null}
      {children}
    </div>
  )
}
