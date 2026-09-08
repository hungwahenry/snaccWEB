import {
  CropIcon,
  DropletIcon,
  PencilIcon,
  RotateCwIcon,
  TypeIcon,
  type LucideIcon,
} from "lucide-react"
import { ColorSwatch } from "@/components/ui/color-swatch"
import { PillTabs, type PillTab } from "@/components/ui/pill-tabs"
import { cn } from "@/lib/utils"
import {
  BLUR_WIDTHS,
  PALETTE,
  STROKE_WIDTHS,
  TEXT_SIZES,
  type Ratio,
  type Tool,
} from "../types"

const TOOLS: { value: Tool; icon: LucideIcon; label: string }[] = [
  { value: "draw", icon: PencilIcon, label: "Draw" },
  { value: "text", icon: TypeIcon, label: "Text" },
  { value: "blur", icon: DropletIcon, label: "Blur" },
  { value: "crop", icon: CropIcon, label: "Crop" },
]

const RATIOS: PillTab<Ratio>[] = [
  { value: "free", label: "Free" },
  { value: "original", label: "Original" },
  { value: "square", label: "1:1" },
  { value: "portrait", label: "4:5" },
  { value: "wide", label: "16:9" },
]

type ToolRailProps = {
  tool: Tool
  onTool: (tool: Tool) => void
  color: string
  onColor: (color: string) => void
  size: number
  onSize: (size: number) => void
  ratio: Ratio
  onRatio: (ratio: Ratio) => void
  onRotate: () => void
}

export function ToolRail({
  tool,
  onTool,
  color,
  onColor,
  size,
  onSize,
  ratio,
  onRatio,
  onRotate,
}: ToolRailProps) {
  const sizes =
    tool === "text" ? TEXT_SIZES : tool === "blur" ? BLUR_WIDTHS : STROKE_WIDTHS
  const tunable = tool !== "crop"
  const coloured = tool === "draw" || tool === "text"

  return (
    <div className="flex flex-col gap-3 pt-3">
      {tool === "crop" ? (
        <div className="flex items-center gap-2 pr-4">
          <div className="min-w-0 flex-1 [&_button]:bg-white/15 [&_button]:text-white [&_button[aria-selected=true]]:bg-white [&_button[aria-selected=true]]:text-black">
            <PillTabs
              tabs={RATIOS}
              value={ratio}
              onChange={onRatio}
              divider={false}
            />
          </div>
          <button
            type="button"
            onClick={onRotate}
            aria-label="Rotate a quarter turn"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white active:scale-95"
          >
            <RotateCwIcon className="size-5" />
          </button>
        </div>
      ) : null}

      {tunable ? (
        <div className="flex [scrollbar-width:none] items-center gap-3 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden">
          {coloured
            ? PALETTE.map((swatch) => (
                <ColorSwatch
                  key={swatch}
                  color={swatch}
                  selected={color === swatch}
                  onPress={() => onColor(swatch)}
                  tone="onDark"
                  className="size-7"
                />
              ))
            : null}
          {coloured ? (
            <span className="mx-1 h-6 w-px shrink-0 bg-white/20" />
          ) : null}
          {sizes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSize(option)}
              aria-label={`Size ${option}`}
              aria-pressed={size === option}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full",
                size === option && "bg-white/25"
              )}
            >
              <span
                className="rounded-full bg-white"
                style={{ width: option / 6 + 6, height: option / 6 + 6 }}
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-around px-4">
        {TOOLS.map((entry) => (
          <button
            key={entry.value}
            type="button"
            onClick={() => onTool(entry.value)}
            aria-label={entry.label}
            aria-pressed={tool === entry.value}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-bold",
              tool === entry.value ? "text-white" : "text-white/50"
            )}
          >
            <entry.icon className="size-6" />
            {entry.label}
          </button>
        ))}
      </div>
    </div>
  )
}
