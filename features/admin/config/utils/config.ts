import { parseJson, prettyJson } from "@/features/admin/shell/utils/json"
import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type { StatusMeta } from "@/features/admin/shell/types"
import type {
  AdminConfigSetting,
  ConfigDraft,
  ConfigGroup,
  ConfigValueKind,
  ConfigValueParse,
  UpdateConfigInput,
} from "../types"

export const PUBLIC_STATUS: StatusMeta = {
  label: "Public",
  variant: "secondary",
}
export const PRIVATE_STATUS: StatusMeta = {
  label: "Private",
  variant: "outline",
}
export const CHANGED_STATUS: StatusMeta = {
  label: "Changed from default",
  variant: "outline",
}

const DECIMAL = /^-?(\d+(\.\d+)?|\.\d+)$/

/** The API's idea of a value's type: a list is its own kind, and null passes as an object. */
function jsonType(value: unknown): string {
  return Array.isArray(value) ? "array" : typeof value
}

function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function valueKind(value: unknown): ConfigValueKind {
  if (typeof value === "boolean") return "boolean"
  if (typeof value === "number") return "number"
  if (typeof value === "string") return "text"

  return "json"
}

/** A setting the code ships as a whole number only ever takes whole numbers of 0 or more. */
export function wantsWholeNumber(setting: AdminConfigSetting): boolean {
  return (
    typeof setting.default_value === "number" &&
    Number.isInteger(setting.default_value)
  )
}

/** A value as it sits in the edit box: JSON pretty-printed, anything else as typed. */
export function editableText(value: unknown): string {
  const kind = valueKind(value)
  if (kind === "json") return prettyJson(value)
  if (kind === "boolean") return ""

  return String(value)
}

/** A value for the table: null when it is an empty string, so the table can say so in words. */
export function previewValue(value: unknown): string | null {
  if (typeof value === "string") return value === "" ? null : value

  return JSON.stringify(value)
}

/**
 * What was typed or switched, as the value the API will accept. The value keeps the type it has,
 * and a setting shipped as a whole number stays a whole number of 0 or more.
 */
export function parseConfigValue(
  setting: AdminConfigSetting,
  input: string | boolean
): ConfigValueParse {
  const kind = valueKind(setting.value)

  if (kind === "boolean") {
    return typeof input === "boolean"
      ? { ok: true, value: input }
      : { ok: false, message: "Turn it on or off." }
  }
  if (typeof input !== "string") {
    return { ok: false, message: "Type a value." }
  }

  if (kind === "number") {
    if (wantsWholeNumber(setting)) {
      const whole = parseWholeNumber(input, { min: 0 })
      return whole === null
        ? { ok: false, message: "Use a whole number of 0 or more." }
        : { ok: true, value: whole }
    }
    const text = input.trim()
    return DECIMAL.test(text)
      ? { ok: true, value: Number(text) }
      : { ok: false, message: "Use a number, like 12 or 0.5." }
  }

  if (kind === "text") return { ok: true, value: input.trim() }

  const parsed = parseJson(input)
  if (!parsed.ok) {
    return {
      ok: false,
      message:
        "That isn't valid JSON. Check for a missing quote, comma or bracket.",
    }
  }
  if (jsonType(parsed.value) !== jsonType(setting.value)) {
    return {
      ok: false,
      message: Array.isArray(setting.value)
        ? "This setting takes a list, in square brackets."
        : "This setting takes an object, in curly braces.",
    }
  }

  return { ok: true, value: parsed.value }
}

export function draftFrom(setting: AdminConfigSetting): ConfigDraft {
  return {
    text: editableText(setting.value),
    on: setting.value === true,
    isPublic: setting.is_public,
  }
}

/** The draft with the value the code ships with, keeping who can see it. */
export function defaultDraft(
  setting: AdminConfigSetting,
  draft: ConfigDraft
): ConfigDraft {
  return {
    ...draft,
    text: editableText(setting.default_value),
    on: setting.default_value === true,
  }
}

export function checkDraft(
  setting: AdminConfigSetting,
  draft: ConfigDraft
): ConfigValueParse {
  return parseConfigValue(
    setting,
    valueKind(setting.value) === "boolean" ? draft.on : draft.text
  )
}

/** Only what changed, so saving the visibility alone never re-sends the value. */
export function toUpdateInput(
  setting: AdminConfigSetting,
  draft: ConfigDraft
): UpdateConfigInput {
  const parsed = checkDraft(setting, draft)
  if (!parsed.ok) throw new Error(parsed.message)

  return {
    ...(!sameValue(parsed.value, setting.value) && { value: parsed.value }),
    ...(draft.isPublic !== setting.is_public && { isPublic: draft.isPublic }),
  }
}

export function isDraftReady(
  setting: AdminConfigSetting,
  draft: ConfigDraft
): boolean {
  if (!checkDraft(setting, draft).ok) return false

  return Object.keys(toUpdateInput(setting, draft)).length > 0
}

/** Settings by category, categories in alphabetical order, settings in the order they came. */
export function groupByCategory(settings: AdminConfigSetting[]): ConfigGroup[] {
  const groups = new Map<string, AdminConfigSetting[]>()
  for (const setting of settings) {
    groups.set(setting.category, [
      ...(groups.get(setting.category) ?? []),
      setting,
    ])
  }

  return [...groups]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, rows]) => ({ category, settings: rows }))
}
