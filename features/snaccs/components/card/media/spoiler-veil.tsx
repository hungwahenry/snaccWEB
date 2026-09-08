import { EyeOffIcon } from "lucide-react"

export function SpoilerVeil() {
  return (
    <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/35">
      <span className="flex size-12 items-center justify-center rounded-full bg-white/20">
        <EyeOffIcon className="size-6 text-white" />
      </span>
      <span className="text-sm font-extrabold text-white">
        Sensitive content
      </span>
      <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold text-white">
        Tap to view
      </span>
    </span>
  )
}
