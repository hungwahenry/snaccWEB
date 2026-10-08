import Link from "next/link"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { stickerPackPath } from "../routes"
import type { StickerPack } from "../types"
import { coverUrlOf } from "../utils/packs"
import { PackCover } from "./pack-cover"
import { PremiumChip } from "./premium-chip"
import { TakenDownChip } from "./taken-down-chip"

export interface PackRowAction {
  label: string
  outline: boolean
  busy?: boolean
  onPress: () => void
}

export function PackRow({
  pack,
  details,
  onOpen,
  action,
  compact = false,
}: {
  pack: StickerPack
  details: string
  onOpen?: () => void
  action?: PackRowAction | null
  compact?: boolean
}) {
  const body: ReactNode = (
    <>
      <PackCover
        url={coverUrlOf(pack)}
        className={cn("rounded-xl", compact ? "size-11" : "size-14")}
      />
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-extrabold text-foreground">
            {pack.title}
          </span>
          {pack.premium ? <PremiumChip /> : null}
          {pack.status === "taken_down" ? <TakenDownChip /> : null}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {details}
        </span>
      </span>
    </>
  )
  const main =
    "flex min-w-0 flex-1 items-center gap-3 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <div
      className={cn("flex items-center gap-3", compact ? "py-2" : "px-4 py-3")}
    >
      {onOpen ? (
        <button type="button" onClick={onOpen} className={main}>
          {body}
        </button>
      ) : (
        <Link href={stickerPackPath(pack.id)} className={main}>
          {body}
        </Link>
      )}

      {action ? (
        <Button
          size="sm"
          variant={action.outline ? "outline" : "default"}
          disabled={action.busy}
          onClick={action.onPress}
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}
