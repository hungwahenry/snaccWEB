"use client"

import { ImagePlus } from "lucide-react"
import { useId, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { LazyImage } from "@/components/ui/lazy-image"

export function PictureField({
  url,
  onPick,
}: {
  url: string | null
  onPick: (file: File) => void
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)

  return (
    <Field>
      <FieldLabel htmlFor={id}>Picture</FieldLabel>
      <div className="flex items-center gap-3">
        {url ? (
          <LazyImage
            src={url}
            alt="The theme's picture"
            className="h-16 w-12 rounded-md border border-border object-cover"
          />
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => input.current?.click()}
        >
          <ImagePlus />
          {url ? "Replace picture" : "Choose a picture"}
        </Button>
      </div>
      <input
        id={id}
        ref={input}
        type="file"
        accept="image/*"
        tabIndex={-1}
        className="sr-only"
        aria-describedby={`${id}-hint`}
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (file) onPick(file)
        }}
      />
      <FieldDescription id={`${id}-hint`}>
        It sits behind every chat that uses this theme, in light and dark mode.
        A tall picture works best. It uploads when you save.
      </FieldDescription>
    </Field>
  )
}
