import { BadgeCheckIcon, BadgeIcon, CheckIcon } from "lucide-react"

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
        <span
          className="relative inline-flex shrink-0"
          style={{ width: size, height: size }}
        >
          <BadgeIcon size={size} color={PREMIUM_COLOR} fill={PREMIUM_COLOR} />
          <CheckIcon
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            size={size * 0.5}
            color="#FFFFFF"
            strokeWidth={3.5}
          />
        </span>
      ) : null}
    </>
  )
}
