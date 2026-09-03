import { BadgeCheckIcon } from "lucide-react"

const PREMIUM_COLOR = "#E8A33D"

export function AuthorBadges({
  official,
  premium,
  size = 16,
}: {
  official: boolean
  premium: boolean
  size?: number
}) {
  return (
    <>
      {official ? (
        <BadgeCheckIcon className="shrink-0 text-foreground" size={size} />
      ) : null}
      {premium ? (
        <BadgeCheckIcon
          className="shrink-0"
          size={size}
          color={PREMIUM_COLOR}
          fill={PREMIUM_COLOR}
        />
      ) : null}
    </>
  )
}
