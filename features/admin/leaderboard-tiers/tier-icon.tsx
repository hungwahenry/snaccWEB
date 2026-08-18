import {
  Award,
  Crown,
  Flame,
  Gem,
  Medal,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react"

/**
 * The tier `icon` column holds a Lucide icon name, resolved here to a component. This allowlist is the
 * palette a tier may wear — keep it in sync with the app's copy (frontend tier-icon.tsx).
 */
const TIER_ICONS: Record<string, LucideIcon> = {
  gem: Gem,
  crown: Crown,
  star: Star,
  medal: Medal,
  award: Award,
  trophy: Trophy,
  shield: Shield,
  sparkles: Sparkles,
  flame: Flame,
  zap: Zap,
}

export const TIER_ICON_NAMES = Object.keys(TIER_ICONS)

export function tierIcon(name: string | null | undefined): LucideIcon | null {
  if (!name) return null
  return TIER_ICONS[name.toLowerCase()] ?? null
}

export function TierIcon({
  name,
  color,
  className,
}: {
  name: string | null | undefined
  color?: string | null
  className?: string
}) {
  const Cmp = tierIcon(name)
  if (!Cmp) return null

  return <Cmp className={className} style={color ? { color } : undefined} />
}
