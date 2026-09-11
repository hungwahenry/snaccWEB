"use client"

import {
  createContext,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { usePendingAction } from "../hooks/use-pending-action"

const CloseDialog = createContext<() => void>(() => {})

/**
 * A dialog whose body mounts only while it is open, so a form inside always starts from what is
 * saved rather than from what was typed and abandoned last time.
 */
export function FormDialog({
  trigger,
  title,
  description,
  disabled,
  wide = false,
  children,
}: {
  trigger: ReactElement
  title: ReactNode
  description?: ReactNode
  disabled?: boolean
  wide?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setMounted(true)
      }}
      onOpenChangeComplete={(next) => {
        if (!next) setMounted(false)
      }}
    >
      <DialogTrigger render={trigger} disabled={disabled} />
      <DialogContent
        className={cn(
          "max-h-[calc(100dvh-2rem)] overflow-y-auto",
          wide && "sm:max-w-2xl"
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {mounted ? (
          <CloseDialog.Provider value={() => setOpen(false)}>
            {children}
          </CloseDialog.Provider>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

/** The body of a FormDialog: Enter submits, and a successful submit closes the dialog. */
export function DialogForm({
  submitLabel,
  canSubmit = true,
  tone = "default",
  onSubmit,
  children,
}: {
  submitLabel: string
  canSubmit?: boolean
  tone?: "default" | "destructive"
  onSubmit: () => Promise<unknown> | void
  children: ReactNode
}) {
  const close = useContext(CloseDialog)
  const [pending, run] = usePendingAction(onSubmit)

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (event) => {
        event.preventDefault()
        if (canSubmit && (await run())) close()
      }}
    >
      {children}
      <DialogFooter>
        <DialogClose
          render={<Button type="button" variant="ghost" disabled={pending} />}
        >
          Cancel
        </DialogClose>
        <Button
          type="submit"
          variant={tone === "destructive" ? "destructive" : "default"}
          disabled={!canSubmit || pending}
        >
          {pending ? <Spinner /> : null}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}

/** Helper copy under a form's fields. */
export function FormNote({ children }: { children: ReactNode }) {
  return <p className="text-xs text-pretty text-muted-foreground">{children}</p>
}
