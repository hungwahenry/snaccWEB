"use client"

import { EllipsisIcon } from "lucide-react"
import type { ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { StickerMenuItem } from "../types"

export function StickerMenu<Id extends string>({
  items,
  label,
  onSelect,
  open,
  onOpenChange,
  className,
  children = <EllipsisIcon className="size-4" />,
}: {
  items: StickerMenuItem<Id>[]
  label: string
  onSelect: (id: Id) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children?: ReactNode
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        aria-label={label}
        title={label}
        className={className}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-52">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            variant={item.destructive ? "destructive" : "default"}
            onClick={() => onSelect(item.id)}
          >
            <item.icon />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
