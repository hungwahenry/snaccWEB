import { ChevronRightIcon, type LucideIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Switch } from "@/components/ui/switch"

export function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-1">
      <Eyebrow className="px-1 pb-1">{title}</Eyebrow>
      {children}
    </section>
  )
}

const ROW =
  "flex w-full items-center gap-3 rounded-2xl py-3.5 text-left transition-colors hover:bg-accent/40 active:opacity-60"

export function Row({
  icon: Icon,
  label,
  href,
  onPress,
}: {
  icon: LucideIcon
  label: string
  href?: string
  onPress?: () => void
}) {
  const body = (
    <>
      <Icon className="size-5 text-muted-foreground" />
      <span className="flex-1 text-base text-foreground">{label}</span>
      <ChevronRightIcon className="size-5 text-muted-foreground" />
    </>
  )
  if (href)
    return (
      <Link href={href} className={ROW}>
        {body}
      </Link>
    )
  return (
    <button type="button" onClick={onPress} className={ROW}>
      {body}
    </button>
  )
}

export function SelectRow({
  icon: Icon,
  label,
  value,
  href,
  onPress,
}: {
  icon: LucideIcon
  label: string
  value: string
  href?: string
  onPress?: () => void
}) {
  const body = (
    <>
      <Icon className="size-5 text-muted-foreground" />
      <span className="flex-1 text-base text-foreground">{label}</span>
      <span className="text-sm text-muted-foreground">{value}</span>
      <ChevronRightIcon className="size-5 text-muted-foreground" />
    </>
  )
  if (href)
    return (
      <Link href={href} className={ROW}>
        {body}
      </Link>
    )
  return (
    <button type="button" onClick={onPress} className={ROW}>
      {body}
    </button>
  )
}

export function ToggleRow({
  icon: Icon,
  label,
  hint,
  value,
  disabled,
  onChange,
}: {
  icon: LucideIcon
  label: string
  hint: string
  value: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <Icon className="size-5 text-muted-foreground" />
      <div className="flex flex-1 flex-col">
        <span className="text-base text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
      <Switch
        checked={value}
        disabled={disabled}
        onCheckedChange={(checked) => onChange(checked)}
        aria-label={label}
      />
    </div>
  )
}
