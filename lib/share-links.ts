import { campusPath } from "@/features/campus/routes"
import { snaccPath } from "@/features/snaccs/routes"
import { profilePath } from "@/features/users/routes"
import { showErrorMessage, showSuccess } from "./feedback"
import { isShareCancel } from "./share-file"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://snacc.fyi"

export const shareLink = {
  profile: (username: string) => SITE_URL + profilePath(username),
  snacc: (id: string) => SITE_URL + snaccPath(id),
  campus: (slug: string) => SITE_URL + campusPath(slug),
  pay: (username: string) => `${SITE_URL}/pay/${encodeURIComponent(username)}`,
}

export function bareLink(url: string): string {
  return url.replace(/^https?:\/\//, "")
}

export async function copyLink(url: string, what = "Link"): Promise<void> {
  try {
    await navigator.clipboard.writeText(url)
    showSuccess(`${what} copied`)
  } catch {
    showErrorMessage("Couldn't copy that link.")
  }
}

export async function shareOrCopy(
  url: string,
  text: string,
  what = "Link"
): Promise<void> {
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ text, url })
      return
    } catch (error) {
      if (isShareCancel(error)) return
    }
  }
  await copyLink(url, what)
}

export type ShareKind = "profile" | "snacc" | "campus" | "pay"

export interface ShareRef {
  kind: ShareKind
  ref: string
}

export interface ShareLinkMatch extends ShareRef {
  start: number
  length: number
}

function escapeForPattern(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const HOST = SITE_URL.replace(/^https?:\/\//, "").replace(/\/+$/, "")

const LINK_PATTERN = new RegExp(
  `(?<![\\w.@/])(?:https?://)?(?:www\\.)?${escapeForPattern(HOST)}/` +
    `(?:@([A-Za-z][A-Za-z0-9_]{2,29})|snacc/([A-Za-z0-9]+)|campus/([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)|pay/([A-Za-z][A-Za-z0-9_]{2,29}))`,
  "gi"
)

function refFrom(match: RegExpExecArray): ShareRef | null {
  const [, profile, snacc, campus, pay] = match

  if (profile) return { kind: "profile", ref: profile }
  if (snacc) return { kind: "snacc", ref: snacc }
  if (campus) return { kind: "campus", ref: campus }
  if (pay) return { kind: "pay", ref: pay }

  return null
}

export function findShareLinks(body: string): ShareLinkMatch[] {
  const found: ShareLinkMatch[] = []
  const pattern = new RegExp(LINK_PATTERN.source, LINK_PATTERN.flags)

  let match: RegExpExecArray | null
  while ((match = pattern.exec(body)) !== null) {
    const ref = refFrom(match)
    if (ref) found.push({ ...ref, start: match.index, length: match[0].length })
  }

  return found
}

/** Joins the text around a removed link; only the seam is touched, never the words. */
export function mend(left: string, right: string): string {
  const leftCore = left.replace(/\s+$/, "")
  const rightCore = right.replace(/^\s+/, "")
  const leftSeam = left.slice(leftCore.length)
  const rightSeam = right.slice(0, right.length - rightCore.length)

  const breaks = Math.max(
    (leftSeam.match(/\n/g) ?? []).length,
    (rightSeam.match(/\n/g) ?? []).length
  )

  if (breaks > 0) return leftCore + "\n".repeat(Math.min(breaks, 2)) + rightCore
  return leftCore + (leftSeam || rightSeam ? " " : "") + rightCore
}

export function withoutShareLinks(body: string): string {
  const links = findShareLinks(body)
  if (links.length === 0) return body

  let out = body.slice(0, links[0].start)
  for (const [index, link] of links.entries()) {
    const nextStart = links[index + 1]?.start ?? body.length
    out = mend(out, body.slice(link.start + link.length, nextStart))
  }

  return out.trim()
}
