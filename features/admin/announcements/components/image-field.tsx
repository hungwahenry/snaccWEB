"use client"

import { ImagePlus } from "lucide-react"
import { useId, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { LazyImage } from "@/components/ui/lazy-image"
import { Spinner } from "@/components/ui/spinner"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { usePendingAction } from "@/features/admin/shell/hooks/use-pending-action"

export function ImageField({
  imageUrl,
  disabled,
  hint,
  onUpload,
  onRemove,
}: {
  imageUrl: string | null
  disabled: boolean
  hint: string
  onUpload: (file: File) => Promise<unknown>
  onRemove: () => Promise<unknown>
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [uploading, upload] = usePendingAction(onUpload)

  return (
    <Field>
      <FieldLabel htmlFor={id}>
        Image{" "}
        <span className="font-normal text-muted-foreground">(optional)</span>
      </FieldLabel>
      {imageUrl ? (
        <LazyImage
          src={imageUrl}
          alt="The announcement's image"
          className="aspect-video w-full max-w-sm rounded-lg border bg-muted/40 object-cover"
        />
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <CanAct permission="announcements.write">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || uploading}
            onClick={() => input.current?.click()}
          >
            {uploading ? <Spinner /> : <ImagePlus />}
            {imageUrl ? "Replace image" : "Add an image"}
          </Button>
        </CanAct>
        {imageUrl ? (
          <CanAct permission="announcements.write">
            <ActionButton
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || uploading}
              onClick={onRemove}
            >
              Remove image
            </ActionButton>
          </CanAct>
        ) : null}
      </div>
      <input
        id={id}
        ref={input}
        type="file"
        accept="image/*"
        tabIndex={-1}
        disabled={disabled || uploading}
        className="sr-only"
        aria-describedby={`${id}-hint`}
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (file) void upload(file)
        }}
      />
      <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>
    </Field>
  )
}
