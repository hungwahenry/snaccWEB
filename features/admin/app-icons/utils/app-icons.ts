import type {
  AdminAppIcon,
  AppIconDraft,
  MoveDirection,
  PositionUpdate,
  UpdateAppIconInput,
} from "../types"

export const LABEL_MAX = 40

/**
 * Moving an icon swaps its position with its neighbour's, so both rows are written: there is no
 * gap to slot into. Null at either end of the list.
 */
export function swapWithNeighbour(
  icons: Pick<AdminAppIcon, "id" | "position">[],
  id: string,
  direction: MoveDirection
): PositionUpdate[] | null {
  const index = icons.findIndex((icon) => icon.id === id)
  if (index === -1) return null

  const icon = icons[index]
  const neighbour = icons[direction === "up" ? index - 1 : index + 1]
  if (!neighbour) return null

  return [
    { id: icon.id, position: neighbour.position },
    { id: neighbour.id, position: icon.position },
  ]
}

export function canMove(
  icons: Pick<AdminAppIcon, "id" | "position">[],
  id: string,
  direction: MoveDirection
): boolean {
  return swapWithNeighbour(icons, id, direction) !== null
}

export function appIconDraft(icon: AdminAppIcon): AppIconDraft {
  return { label: icon.label }
}

/** The name to save, or null while it is blank or too long. */
export function toLabel(draft: AppIconDraft): string | null {
  const label = draft.label.trim()

  return label.length > 0 && label.length <= LABEL_MAX ? label : null
}

export function appIconMessage(
  icon: Pick<AdminAppIcon, "label" | "enabled">,
  input: UpdateAppIconInput
): string {
  if (input.enabled === undefined) return `Renamed to ${icon.label}.`

  return icon.enabled
    ? `${icon.label} is offered in the picker.`
    : `${icon.label} is no longer offered.`
}
