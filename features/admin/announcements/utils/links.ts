import { EDIT_PROFILE_PATH } from "@/features/account/routes"
import { EGGS_PATH } from "@/features/eggs/routes"
import { HANGOUTS_PATH } from "@/features/hangouts/routes"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { INVITE_PATH } from "@/features/referrals/routes"
import { SCORE_PATH } from "@/features/score/routes"
import { EARNINGS_PATH, WALLET_PATH } from "@/features/wallet/routes"
import type { Option } from "@/features/admin/shell/types"
import type { ButtonLink, LinkPreset, LinkPresetKey } from "../types"

const SNACC_ORIGIN = "https://snacc.fyi"

const SNACC_HOSTS = ["snacc.fyi", "www.snacc.fyi"]

export const URL_MAX = 500

export const LINK_PRESETS: LinkPreset[] = [
  { key: "premium", label: "Premium", path: PREMIUM_PATH },
  { key: "invite", label: "Invite friends", path: INVITE_PATH },
  { key: "score", label: "Snacc Score", path: SCORE_PATH },
  { key: "wallet", label: "Wallet", path: WALLET_PATH },
  { key: "earnings", label: "Earnings", path: EARNINGS_PATH },
  { key: "eggs", label: "Easter eggs", path: EGGS_PATH },
  { key: "hangouts", label: "Hangouts", path: HANGOUTS_PATH },
  { key: "edit-profile", label: "Edit profile", path: EDIT_PROFILE_PATH },
]

export const LINK_OPTIONS: Option<ButtonLink>[] = [
  ...LINK_PRESETS.map(({ key, label }) => ({ value: key, label })),
  { value: "other", label: "Another link" },
]

export function presetUrl(key: LinkPresetKey): string {
  const preset = LINK_PRESETS.find((each) => each.key === key)

  return `${SNACC_ORIGIN}${preset?.path ?? ""}`
}

export function linkFor(url: string): { link: ButtonLink; url: string } {
  const preset = LINK_PRESETS.find((each) => presetUrl(each.key) === url)

  return preset ? { link: preset.key, url: "" } : { link: "other", url }
}

export function linkUrl(link: ButtonLink | null, url: string): string {
  if (link === null) return ""
  if (link === "other") return url.trim()

  return presetUrl(link)
}

export function isHttpsLink(text: string): boolean {
  const value = text.trim()
  if (value === "" || value.length > URL_MAX || /\s/.test(value)) return false

  try {
    const url = new URL(value)
    return url.protocol === "https:" && url.hostname.includes(".")
  } catch {
    return false
  }
}

export function linkHint(text: string): { text: string; problem: boolean } {
  if (text.trim() === "") {
    return {
      text: "A snacc.fyi link opens inside Snacc. Any other https link opens in their browser.",
      problem: false,
    }
  }
  if (!isHttpsLink(text)) {
    return {
      text: "Paste a full link that starts with https://",
      problem: true,
    }
  }

  return SNACC_HOSTS.includes(new URL(text.trim()).hostname)
    ? { text: "Opens inside Snacc.", problem: false }
    : { text: "Opens in their browser.", problem: false }
}
