import {
  BookOpenIcon,
  ChartNoAxesColumnIcon,
  EyeIcon,
  FlameIcon,
  GemIcon,
  HeartIcon,
  PaletteIcon,
  RocketIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  WandSparklesIcon,
  type LucideIcon,
} from "lucide-react"

// The icon name is a database value, so it is matched against this rather than trusted.
const ICON_BY_NAME: Record<string, LucideIcon> = {
  book: BookOpenIcon,
  chart: ChartNoAxesColumnIcon,
  eye: EyeIcon,
  flame: FlameIcon,
  gem: GemIcon,
  heart: HeartIcon,
  palette: PaletteIcon,
  rocket: RocketIcon,
  star: StarIcon,
  sun: SunIcon,
  wand: WandSparklesIcon,
}

export function benefitIcon(name: string): LucideIcon {
  return ICON_BY_NAME[name] ?? SparklesIcon
}

export const PLAN_LABELS: Record<string, string> = {
  monthly: "A month",
  yearly: "A year",
}
