import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import type { ComponentProps } from "react"
import { BudgetField, BudgetPresets } from "../form/budget-field"

export function TopUpSheet({
  open,
  onOpenChange,
  presets,
  field,
  problem,
  label,
  ready,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  presets: ComponentProps<typeof BudgetPresets>
  field: ComponentProps<typeof BudgetField>
  problem: string | null
  label: string
  ready: boolean
  onAdd: () => void
}) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Add to the budget"
      className="flex flex-col gap-3 px-4"
      footer={
        <Button
          size="lg"
          className="h-12 w-full"
          disabled={!ready}
          onClick={onAdd}
        >
          {label}
        </Button>
      }
    >
      <BudgetPresets {...presets} />
      <BudgetField {...field} />
      {problem ? (
        <p role="alert" className="px-1 text-sm text-destructive">
          {problem}
        </p>
      ) : null}
    </ActionSheet>
  )
}
