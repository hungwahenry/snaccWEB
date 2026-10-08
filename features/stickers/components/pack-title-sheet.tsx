import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export type PackTitleSheetProps = {
  heading: string
  action: string
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  maxLength: number
  onTitleChange: (title: string) => void
  canSave: boolean
  saving: boolean
  onSave: () => void
}

export function PackTitleSheet({
  heading,
  action,
  open,
  onOpenChange,
  title,
  maxLength,
  onTitleChange,
  canSave,
  saving,
  onSave,
}: PackTitleSheetProps) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={heading}
      hint="Anyone who adds your pack sees this name."
      footer={
        <Button className="h-12 w-full" disabled={!canSave} onClick={onSave}>
          {saving ? <Spinner /> : action}
        </Button>
      }
    >
      <form
        className="flex flex-col gap-1.5 px-5 pt-1"
        onSubmit={(event) => {
          event.preventDefault()
          onSave()
        }}
      >
        <Input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          maxLength={maxLength}
          placeholder="Exam season"
          aria-label="Pack name"
          autoFocus
          className="h-12 px-4 text-base md:text-base"
        />
        <span className="self-end text-xs text-muted-foreground">
          {title.length}/{maxLength}
        </span>
      </form>
    </ActionSheet>
  )
}
