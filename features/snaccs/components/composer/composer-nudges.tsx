import { PremiumNudge } from "@/features/premium/components/premium-nudge"

type Upgrade = { show: boolean; label: string }

/**
 * Where every limit the composer can hit says that Premium would move it.
 *
 * One row, above the toolbar rather than inside it: the toolbar is icon buttons with no room for
 * words, and this has to appear for a snacc with no attachments at all — which is most of them.
 */
export function ComposerNudges({
  body,
  image,
}: {
  body: Upgrade
  image: Upgrade
}) {
  if (!body.show && !image.show) return null

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 pb-2">
      <PremiumNudge show={image.show} label={image.label} />
      <PremiumNudge show={body.show} label={body.label} />
    </div>
  )
}
