import { PlusIcon, type LucideIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface ComposerAction {
  key: string
  icon: LucideIcon
  label: string
  hint: string
  onPress: () => void
}

export function ComposerActionsMenu({
  actions,
}: {
  actions: ComposerAction[]
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Add to message"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-input text-foreground transition-colors hover:bg-accent"
      >
        <PlusIcon className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="min-w-56">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.key}
            onClick={action.onPress}
            className="items-start py-2.5"
          >
            <action.icon className="mt-0.5" />
            <span className="flex flex-col">
              <span className="font-bold">{action.label}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {action.hint}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
