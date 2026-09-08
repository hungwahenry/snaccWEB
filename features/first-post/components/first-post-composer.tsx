"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFirstPostComposer } from "../hooks/use-first-post-composer"

export function FirstPostComposer({
  onPosted,
  onSkip,
}: {
  onPosted: () => void
  onSkip?: () => void
}) {
  const composer = useFirstPostComposer(onPosted)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {composer.prompts.map((prompt, index) => (
          <button
            key={prompt.label}
            type="button"
            aria-pressed={index === composer.active}
            onClick={() => composer.selectPrompt(index)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-sm font-bold transition-colors",
              index === composer.active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:bg-accent"
            )}
          >
            {prompt.emoji} {prompt.label}
          </button>
        ))}
      </div>

      <textarea
        value={composer.text}
        onChange={(event) => composer.setText(event.target.value)}
        placeholder={composer.placeholder}
        maxLength={composer.maxLength}
        rows={3}
        className="field-sizing-content min-h-20 resize-none bg-transparent text-base leading-6 text-foreground outline-none placeholder:text-muted-foreground"
      />

      <Button
        size="lg"
        className="h-12 font-extrabold"
        disabled={!composer.canPost}
        onClick={composer.submit}
      >
        Post to {composer.campus}
      </Button>

      {onSkip ? (
        <button
          type="button"
          onClick={onSkip}
          className="py-1 text-sm font-bold text-muted-foreground transition-opacity active:opacity-60"
        >
          Skip for now
        </button>
      ) : null}
    </div>
  )
}
