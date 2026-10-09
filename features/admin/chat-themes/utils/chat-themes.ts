import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type {
  ChatBackground,
  ChatLook,
  ChatPaint,
  ChatThemeKind,
} from "@/features/chat-themes/types"
import { countLabel } from "@/lib/format"
import type {
  AdminChatTheme,
  ChatThemeDraft,
  CreateChatThemeInput,
  LookMode,
  PaintDraft,
  UpdateChatThemeInput,
} from "../types"

export const THEME_LIMITS = {
  keyMin: 2,
  key: 40,
  label: 40,
  stopsMin: 2,
  stopsMax: 4,
  angle: 360,
} as const

export const LOOK_MODES: readonly LookMode[] = ["light", "dark"]

export const WASH_MAX = 95

const DEFAULT_WASH: Record<LookMode, string> = {
  light: "rgba(255, 255, 255, 0.45)",
  dark: "rgba(0, 0, 0, 0.45)",
}

const MODE_NAMES: Record<LookMode, string> = { light: "Light", dark: "Dark" }
const KEY = /^[a-z0-9]+(?:_[a-z0-9]+)*$/
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i
const RGB = /^rgba?\(([^)]+)\)$/i
const CHANNEL = /^\d{1,3}$/
const ALPHA = /^(?:0|1|0?\.\d+|1\.0+)$/
const DEFAULT_ANGLE = 160

const STARTER: ChatLook = {
  light: {
    background: {
      kind: "gradient",
      colors: ["#F3E8FF", "#E0E7FF"],
      angle: DEFAULT_ANGLE,
    },
    wash: null,
    mine: { fill: "#6D28D9", text: "#FFFFFF" },
    theirs: { fill: "#FFFFFF", text: "#1E1B4B" },
    meta: "#6B6390",
  },
  dark: {
    background: {
      kind: "gradient",
      colors: ["#1E1033", "#111827"],
      angle: DEFAULT_ANGLE,
    },
    wash: null,
    mine: { fill: "#7C3AED", text: "#FFFFFF" },
    theirs: { fill: "#2A2342", text: "#EDE9FE" },
    meta: "#A59FC4",
  },
}

function rgbParts(value: string): string[] | null {
  const rgb = RGB.exec(value.trim())
  if (!rgb) return null
  const parts = rgb[1].split(",").map((part) => part.trim())
  const [alpha] = parts.slice(3)
  const valid =
    parts.length >= 3 &&
    parts.length <= 4 &&
    parts
      .slice(0, 3)
      .every((part) => CHANNEL.test(part) && Number(part) <= 255) &&
    (alpha === undefined || ALPHA.test(alpha))

  return valid ? parts : null
}

export function isColor(value: string): boolean {
  return HEX.test(value.trim()) || rgbParts(value) !== null
}

export function hexOf(value: string): string {
  const text = value.trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(text)) return text
  if (/^#[0-9a-f]{3}$/.test(text)) {
    return `#${[...text.slice(1)].map((digit) => digit + digit).join("")}`
  }

  const parts = rgbParts(text)
  if (!parts) return "#000000"
  return `#${parts
    .slice(0, 3)
    .map((part) => Number(part).toString(16).padStart(2, "0"))
    .join("")}`
}

export interface WashParts {
  color: string
  opacity: number
}

export function washParts(wash: string): WashParts {
  const alpha = rgbParts(wash)?.[3]
  return {
    color: hexOf(wash),
    opacity: Math.round((alpha === undefined ? 1 : Number(alpha)) * 100),
  }
}

export function washOf(color: string, opacity: number): string {
  const hex = hexOf(color)
  const [r, g, b] = [1, 3, 5].map((at) =>
    Number.parseInt(hex.slice(at, at + 2), 16)
  )
  return `rgba(${r}, ${g}, ${b}, ${Math.min(opacity, WASH_MAX) / 100})`
}

function paintDraftOf(paint: ChatPaint): PaintDraft {
  const { background } = paint
  const stops = background?.kind === "gradient" ? background.colors : null
  const solid =
    background?.kind === "solid"
      ? background.color
      : (stops?.[0] ?? paint.theirs.fill)

  return {
    style: background?.kind ?? "gradient",
    solid,
    stops: stops ? [...stops] : [solid, solid],
    angle: String(
      background?.kind === "gradient" ? background.angle : DEFAULT_ANGLE
    ),
    wash: paint.wash ?? "",
    mineFill: paint.mine.fill,
    mineText: paint.mine.text,
    theirsFill: paint.theirs.fill,
    theirsText: paint.theirs.text,
    meta: paint.meta,
  }
}

export function draftFrom(theme?: AdminChatTheme): ChatThemeDraft {
  const look = theme?.look ?? STARTER

  return {
    key: theme?.key ?? "",
    label: theme?.label ?? "",
    kind: theme?.kind ?? "preset",
    position: theme ? String(theme.position) : "",
    picture: null,
    pictureUrl: theme?.image_url ?? null,
    light: paintDraftOf(look.light),
    dark: paintDraftOf(look.dark),
  }
}

function backgroundOf(paint: PaintDraft): ChatBackground {
  return paint.style === "solid"
    ? { kind: "solid", color: paint.solid.trim() }
    : {
        kind: "gradient",
        colors: paint.stops.map((stop) => stop.trim()),
        angle:
          parseWholeNumber(paint.angle, { min: 0, max: THEME_LIMITS.angle }) ??
          DEFAULT_ANGLE,
      }
}

export function paintOfDraft(
  paint: PaintDraft,
  kind: ChatThemeKind
): ChatPaint {
  return {
    background: kind === "preset" ? backgroundOf(paint) : null,
    wash: paint.wash.trim() || null,
    mine: { fill: paint.mineFill.trim(), text: paint.mineText.trim() },
    theirs: { fill: paint.theirsFill.trim(), text: paint.theirsText.trim() },
    meta: paint.meta.trim(),
  }
}

export function withKind(
  draft: ChatThemeDraft,
  kind: ChatThemeKind
): ChatThemeDraft {
  if (kind === "preset") return { ...draft, kind }

  const washed = (mode: LookMode): PaintDraft =>
    draft[mode].wash.trim()
      ? draft[mode]
      : { ...draft[mode], wash: DEFAULT_WASH[mode] }
  return { ...draft, kind, light: washed("light"), dark: washed("dark") }
}

export function withStop(paint: PaintDraft): PaintDraft {
  if (paint.stops.length >= THEME_LIMITS.stopsMax) return paint
  return { ...paint, stops: [...paint.stops, paint.stops.at(-1) ?? "#FFFFFF"] }
}

export function withoutStop(paint: PaintDraft, index: number): PaintDraft {
  if (paint.stops.length <= THEME_LIMITS.stopsMin) return paint
  return { ...paint, stops: paint.stops.filter((_, at) => at !== index) }
}

export function withStopColor(
  paint: PaintDraft,
  index: number,
  color: string
): PaintDraft {
  return {
    ...paint,
    stops: paint.stops.map((stop, at) => (at === index ? color : stop)),
  }
}

function paintProblem(paint: PaintDraft, kind: ChatThemeKind): string | null {
  if (kind === "preset" && paint.style === "solid" && !isColor(paint.solid)) {
    return "the background isn't a colour."
  }
  if (kind === "preset" && paint.style === "gradient") {
    if (!paint.stops.every(isColor)) return "a gradient colour isn't a colour."
    if (
      parseWholeNumber(paint.angle, { min: 0, max: THEME_LIMITS.angle }) ===
      null
    ) {
      return `the gradient angle must be 0 to ${THEME_LIMITS.angle}.`
    }
  }
  const wash = paint.wash.trim()
  if (kind !== "preset" && wash === "") {
    return "the wash is needed over a picture so the chat stays readable."
  }
  if (wash && !isColor(wash)) return "the wash isn't a colour."
  if (kind !== "preset" && washParts(wash).opacity >= 100) {
    return "the wash must be see-through over a picture."
  }

  const colors: [string, string][] = [
    [paint.mineFill, "your bubble"],
    [paint.mineText, "your bubble's text"],
    [paint.theirsFill, "their bubble"],
    [paint.theirsText, "their bubble's text"],
    [paint.meta, "the small print"],
  ]
  const wrong = colors.find(([color]) => !isColor(color))
  return wrong ? `${wrong[1]} isn't a colour.` : null
}

export function draftProblem(draft: ChatThemeDraft): string | null {
  const key = draft.key.trim()
  if (
    key.length < THEME_LIMITS.keyMin ||
    key.length > THEME_LIMITS.key ||
    !KEY.test(key)
  ) {
    return "The key needs 2 to 40 lowercase letters, numbers or underscores."
  }
  const label = draft.label.trim()
  if (label === "" || label.length > THEME_LIMITS.label) {
    return `Give it a name of up to ${THEME_LIMITS.label} characters.`
  }
  if (
    draft.position.trim() !== "" &&
    parseWholeNumber(draft.position, { min: 0 }) === null
  ) {
    return "Position must be a whole number, 0 or more."
  }
  if (draft.kind === "image" && !draft.picture && !draft.pictureUrl) {
    return "Choose the picture that sits behind it."
  }

  for (const mode of LOOK_MODES) {
    const problem = paintProblem(draft[mode], draft.kind)
    if (problem) return `${MODE_NAMES[mode]} mode: ${problem}`
  }
  return null
}

function lookOf(draft: ChatThemeDraft): ChatLook {
  return {
    light: paintOfDraft(draft.light, draft.kind),
    dark: paintOfDraft(draft.dark, draft.kind),
  }
}

function positionOf(draft: ChatThemeDraft): { position?: number } {
  const position = parseWholeNumber(draft.position, { min: 0 })
  return position === null ? {} : { position }
}

export function toCreateInput(draft: ChatThemeDraft): CreateChatThemeInput {
  return {
    key: draft.key.trim(),
    label: draft.label.trim(),
    kind: draft.kind,
    look: lookOf(draft),
    ...positionOf(draft),
  }
}

export function toUpdateInput(draft: ChatThemeDraft): UpdateChatThemeInput {
  return {
    label: draft.label.trim(),
    look: lookOf(draft),
    ...positionOf(draft),
  }
}

export function kindNote(
  theme: Pick<AdminChatTheme, "kind" | "image_url">
): string {
  if (theme.kind === "photo") return " · each person's photo"
  if (theme.kind === "image") {
    return theme.image_url ? " · picture" : " · no picture yet"
  }
  return ""
}

export function deleteWarning(
  theme: Pick<AdminChatTheme, "in_use" | "kind">
): string {
  if (theme.in_use === 0) return "Nobody is using it, so no chat changes."

  const photos =
    theme.kind === "photo"
      ? " The photos people put behind it are deleted too."
      : ""
  const goes = theme.in_use === 1 ? "goes" : "go"
  return `Used in ${countLabel(theme.in_use, "chat")}, which ${goes} back to the default look straight away.${photos}`
}

export function chatThemeMessage(
  theme: Pick<AdminChatTheme, "label" | "enabled" | "premium">,
  input: UpdateChatThemeInput
): string {
  if (input.premium !== undefined) {
    return theme.premium
      ? `${theme.label} now needs Premium.`
      : `${theme.label} is free for everyone.`
  }
  return theme.enabled
    ? `${theme.label} is offered in the picker.`
    : `${theme.label} is no longer offered.`
}
