import {
  CopyIcon,
  LinkIcon,
  QrCodeIcon,
  ShareIcon,
  ZapIcon,
} from "lucide-react"
import { PayCode } from "@/features/pay/components/pay-code"
import { bareLink } from "@/lib/share-links"
import { PerkRow } from "../shared/perk-row"

export function PayLinkPanel({
  username,
  avatarUrl,
  link,
  onCopy,
  onShare,
}: {
  username: string
  avatarUrl: string | null
  link: string
  onCopy: () => void
  onShare: () => void
}) {
  return (
    <div className="flex flex-col gap-7 px-6 py-6">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary p-6">
        <div className="rounded-[28px] bg-white p-5">
          <PayCode value={link} avatarUrl={avatarUrl} />
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <p className="text-xl font-extrabold text-primary-foreground">
            @{username}
          </p>
          <p className="text-sm text-primary-foreground/70">{bareLink(link)}</p>
        </div>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy your pay link"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary-foreground text-sm font-extrabold text-primary transition-opacity active:opacity-80"
          >
            <CopyIcon className="size-[18px]" /> Copy link
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label="Share your pay link"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-primary-foreground/30 text-sm font-extrabold text-primary-foreground transition-opacity active:opacity-70"
          >
            <ShareIcon className="size-[18px]" /> Share
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-1">
        <PerkRow
          icon={QrCodeIcon}
          title="Show it in person"
          text="They scan your code, type an amount, and pay."
        />
        <PerkRow
          icon={LinkIcon}
          title="Or drop the link anywhere"
          text="It works in any chat — even for people not on Snacc yet."
        />
        <PerkRow
          icon={ZapIcon}
          title="Straight to your wallet"
          text="Payments land in your Snacc balance instantly."
        />
      </div>
    </div>
  )
}
