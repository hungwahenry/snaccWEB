import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { PackTitleField as PackTitleFieldProps } from "../hooks/use-pack-title"

export function PackTitleField({
  value,
  placeholder,
  action,
  maxLength,
  canSave,
  saving,
  onChange,
  onSave,
  onCancel,
}: PackTitleFieldProps) {
  return (
    <form
      className="flex w-full items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        if (canSave) onSave()
      }}
    >
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onCancel?.()
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={maxLength}
        autoFocus={onCancel !== undefined}
        className="min-w-0 flex-1"
      />
      {onCancel ? (
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      ) : null}
      <Button type="submit" size="sm" disabled={!canSave}>
        {saving ? <Spinner /> : null}
        {action}
      </Button>
    </form>
  )
}
