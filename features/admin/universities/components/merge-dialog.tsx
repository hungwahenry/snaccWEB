"use client"

import { useMemo, useState, type ReactElement } from "react"
import { SearchSelectField } from "@/features/admin/shell/components/form-fields"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import type { AdminUniversity } from "../types"
import { mergeTargets } from "../utils/status"

function MergeForm({
  campus,
  campuses,
  onMerge,
}: {
  campus: AdminUniversity
  campuses: AdminUniversity[]
  onMerge: (intoId: string) => Promise<unknown>
}) {
  const [intoId, setIntoId] = useState<string | null>(null)
  const targets = useMemo(
    () => mergeTargets(campuses, campus),
    [campuses, campus]
  )

  return (
    <DialogForm
      submitLabel="Merge"
      tone="destructive"
      canSubmit={intoId !== null}
      onSubmit={() => (intoId ? onMerge(intoId) : undefined)}
    >
      <SearchSelectField
        label="The real campus"
        value={intoId}
        onChange={setIntoId}
        options={targets}
        placeholder="Search campuses"
        empty="No campus by that name."
      />
      <FormNote>
        Everything at {campus.name} moves to the campus you pick: its{" "}
        {campus.stats.profiles} people, {campus.stats.snaccs} snaccs, its chat
        room, fund, hashtag counts and campus roles. Then {campus.name} is
        deleted. This can&apos;t be undone.
      </FormNote>
    </DialogForm>
  )
}

export function MergeDialog({
  campus,
  campuses,
  trigger,
  onMerge,
}: {
  campus: AdminUniversity
  campuses: AdminUniversity[]
  trigger: ReactElement
  onMerge: (intoId: string) => Promise<unknown>
}) {
  return (
    <FormDialog trigger={trigger} title={`Merge ${campus.name} into…`}>
      <MergeForm campus={campus} campuses={campuses} onMerge={onMerge} />
    </FormDialog>
  )
}
