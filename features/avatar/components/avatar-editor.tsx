"use client"

import { BanIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PillTabs } from "@/components/ui/pill-tabs"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { cn } from "@/lib/utils"
import { useAvatarEditor } from "../hooks/use-avatar-editor"

export function AvatarEditor() {
  const router = useRouter()
  const editor = useAvatarEditor(() => router.back())

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-center py-6">
        <UserAvatar
          avatarUrl={editor.avatarUrl}
          alt="Your avatar"
          className="size-32"
        />
      </div>

      <PillTabs
        tabs={editor.tabs}
        value={editor.activeKey}
        onChange={editor.setActiveKey}
      />

      <div className="flex-1 overflow-y-auto">
        <div
          className="grid gap-y-4 px-4 pt-4 pb-6"
          style={{
            gridTemplateColumns: `repeat(${editor.columns}, minmax(0, 1fr))`,
          }}
        >
          {editor.category.choices.map((choice) => {
            const ring = cn(
              "rounded-full border-2",
              editor.isSelected(choice)
                ? "border-foreground"
                : "border-transparent"
            )

            return (
              <div key={choice.id} className="flex justify-center">
                {editor.category.kind === "color" ? (
                  <button
                    type="button"
                    aria-label={choice.swatch ?? "None"}
                    onClick={() => editor.pick(choice)}
                    className={cn(
                      "flex size-14 items-center justify-center",
                      ring
                    )}
                  >
                    {choice.swatch ? (
                      <span
                        className="size-11 rounded-full border border-border"
                        style={{ backgroundColor: choice.swatch }}
                      />
                    ) : (
                      <span className="flex size-11 items-center justify-center rounded-full border border-border">
                        <BanIcon className="size-5 text-muted-foreground" />
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label={choice.id}
                    onClick={() => editor.pick(choice)}
                    className={ring}
                  >
                    {choice.id === "none" ? (
                      <span className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <BanIcon className="size-6 text-muted-foreground" />
                      </span>
                    ) : (
                      <UserAvatar
                        avatarUrl={editor.preview(choice)}
                        alt=""
                        className="size-16"
                      />
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pt-2 pb-4">
        <Button
          size="lg"
          className="w-full"
          disabled={editor.saving}
          onClick={editor.submit}
        >
          {editor.saving ? <Spinner /> : "Save avatar"}
        </Button>
        <Button variant="ghost" size="sm" onClick={editor.reset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
