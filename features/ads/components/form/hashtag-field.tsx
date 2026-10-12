import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { hashtagLabel } from "@/features/hashtags/utils/labels"
import { RemovableChip } from "./choice-chips"

export function HashtagField({
  tags,
  text,
  full,
  onText,
  onAdd,
  onRemove,
}: {
  tags: string[]
  text: string
  full: boolean
  onText: (next: string) => void
  onAdd: () => void
  onRemove: (tag: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <RemovableChip
              key={tag}
              label={hashtagLabel(tag)}
              removeLabel={`Remove ${hashtagLabel(tag)}`}
              onRemove={() => onRemove(tag)}
            />
          ))}
        </div>
      ) : null}

      {full ? null : (
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(event) => onText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== ",") return
              event.preventDefault()
              onAdd()
            }}
            placeholder="#tag"
            aria-label="Add a hashtag"
            autoCorrect="off"
            autoCapitalize="off"
            className="h-12 rounded-full px-5 text-base md:text-base"
          />
          <Button
            variant="secondary"
            className="h-12 shrink-0 rounded-full px-5"
            disabled={!text.trim()}
            onClick={onAdd}
          >
            Add
          </Button>
        </div>
      )}
    </div>
  )
}
