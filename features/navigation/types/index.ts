import type { LucideIcon } from "lucide-react"

export interface NavItem {
  key: string
  href: string
  label: string
  icon: LucideIcon
  badge?: number
  avatarUrl?: string | null
  avatarFallback?: string
}
