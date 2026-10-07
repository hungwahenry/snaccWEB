import {
  BookOpenIcon,
  CalendarClockIcon,
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

const ICON_BY_NAME: Record<string, LucideIcon> = {
  book: BookOpenIcon,
  calendar: CalendarClockIcon,
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
