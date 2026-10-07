"use client"

import { useMemo } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import type { Option } from "@/features/admin/shell/types"

export function CampusPicker({
  id,
  options,
  acronyms,
  value,
  onChange,
}: {
  id: string
  options: Option[]
  acronyms: ReadonlyMap<string, string>
  value: string[]
  onChange: (campusIds: string[]) => void
}) {
  const anchor = useComboboxAnchor()
  const labels = useMemo(
    () => new Map(options.map((option) => [option.value, option.label])),
    [options]
  )
  const items = useMemo(() => options.map((option) => option.value), [options])

  return (
    <Combobox
      multiple
      autoHighlight
      items={items}
      value={value}
      onValueChange={onChange}
      itemToStringLabel={(campusId: string) => labels.get(campusId) ?? ""}
    >
      <ComboboxChips ref={anchor} className="w-full">
        <ComboboxValue>
          {(picked: string[]) => (
            <>
              {picked.map((campusId) => (
                <ComboboxChip key={campusId}>
                  {acronyms.get(campusId) ?? "Campus"}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                id={id}
                placeholder={picked.length === 0 ? "Every campus" : undefined}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No campus by that name.</ComboboxEmpty>
        <ComboboxList>
          {(campusId: string) => (
            <ComboboxItem key={campusId} value={campusId}>
              {labels.get(campusId)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
