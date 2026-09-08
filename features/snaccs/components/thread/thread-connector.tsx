import { cn } from "@/lib/utils"

export function ThreadConnector({ className }: { className?: string }) {
  return (
    <div
      className={cn("my-2 w-0.5 flex-1 rounded-full bg-border", className)}
    />
  )
}
