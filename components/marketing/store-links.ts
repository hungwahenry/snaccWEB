export const APP_STORE_URL = "https://apps.apple.com/app/snacc"
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.snacc.fyi"

export type StoreTarget = { href: string; label: string }

export function detectStore(userAgent: string): StoreTarget | null {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return { href: APP_STORE_URL, label: "Download on the App Store" }
  if (/Android/i.test(userAgent)) return { href: PLAY_STORE_URL, label: "Get it on Google Play" }
  return null
}
