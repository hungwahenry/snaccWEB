import { cn } from "@/lib/utils"

export function GiphyAttribution({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "pt-4 text-center text-[11px] font-bold tracking-wide text-muted-foreground uppercase",
        className
      )}
    >
      Powered by GIPHY
    </p>
  )
}
