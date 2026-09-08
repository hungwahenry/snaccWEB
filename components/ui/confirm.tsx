"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRef, useSyncExternalStore } from "react"

export type ConfirmAction = {
  label: string
  destructive?: boolean
  onPress: () => void
}

export type ConfirmOptions = {
  title: string
  message?: string
  cancelLabel?: string
  onCancel?: () => void
  actions: ConfirmAction[]
}

type ConfirmState = { options: ConfirmOptions | null; open: boolean }

let state: ConfirmState = { options: null, open: false }
const listeners = new Set<() => void>()

function set(next: ConfirmState): void {
  state = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => state
const getServerSnapshot = (): ConfirmState => ({ options: null, open: false })

export function confirm(options: ConfirmOptions): void {
  set({ options, open: true })
}

export function ConfirmHost() {
  const { options, open } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const acted = useRef(false)

  if (!options) return null

  // Two choices read as a pair; more than that would not fit across, so they stack.
  const pair = options.actions.length === 2

  function run(action: ConfirmAction) {
    acted.current = true
    set({ options, open: false })
    action.onPress()
  }

  function onOpenChange(next: boolean) {
    if (next) return
    const handled = acted.current
    acted.current = false
    set({ options, open: false })
    if (!handled) options?.onCancel?.()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-extrabold tracking-tight">
            {options.title}
          </AlertDialogTitle>
          {options.message ? (
            <AlertDialogDescription>{options.message}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        {/* The footer is already a two-column grid, so a pair fills one row and Cancel spans both. */}
        <AlertDialogFooter>
          {options.actions.map((action) => (
            <Button
              key={action.label}
              size="lg"
              variant={action.destructive ? "destructive" : "default"}
              onClick={() => run(action)}
            >
              {action.label}
            </Button>
          ))}
          <Button
            size="lg"
            variant="outline"
            className={cn(pair && "col-span-2 w-full")}
            onClick={() => onOpenChange(false)}
          >
            {options.cancelLabel ?? "Cancel"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
