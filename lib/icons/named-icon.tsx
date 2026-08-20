import { createElement } from "react"
import {
  Award,
  BookOpen,
  Check,
  Crown,
  Flame,
  Gem,
  GraduationCap,
  HandHeart,
  Heart,
  Medal,
  Megaphone,
  Mic,
  Music,
  PartyPopper,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Sun,
  Trophy,
  Users,
  WandSparkles,
  Zap,
  type LucideIcon,
} from "lucide-react"

/** Keep in sync with the app's copy (frontend lib/icons/named-icon.tsx); a name missing there
 *  renders as nothing on a phone. */
const NAMED_ICONS: Record<string, LucideIcon> = {
  award: Award,
  book: BookOpen,
  check: Check,
  crown: Crown,
  flame: Flame,
  gem: Gem,
  graduation: GraduationCap,
  hands: HandHeart,
  heart: Heart,
  medal: Medal,
  megaphone: Megaphone,
  mic: Mic,
  music: Music,
  party: PartyPopper,
  rocket: Rocket,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  trophy: Trophy,
  users: Users,
  wand: WandSparkles,
  zap: Zap,
}

export const NAMED_ICON_NAMES = Object.keys(NAMED_ICONS)

export function namedIcon(name: string | null | undefined): LucideIcon | null {
  if (!name) return null
  return NAMED_ICONS[name.toLowerCase()] ?? null
}

export function NamedIcon({
  name,
  color,
  className,
}: {
  name: string | null | undefined
  color?: string | null
  className?: string
}) {
  const icon = namedIcon(name)
  if (!icon) return null

  // createElement, not JSX: a capitalised local in JSX position reads as a component made in render.
  return createElement(icon, { className, style: color ? { color } : undefined })
}
