import { copyLink, shareLink, shareOrCopy } from "@/lib/share-links"

export function payLinkFor(username: string): string {
  return shareLink.pay(username)
}

export function sharePayLink(username: string) {
  return shareOrCopy(
    payLinkFor(username),
    "Send me money on Snacc 💸",
    "Your pay link"
  )
}

export function copyPayLink(username: string) {
  return copyLink(payLinkFor(username), "Your pay link")
}
