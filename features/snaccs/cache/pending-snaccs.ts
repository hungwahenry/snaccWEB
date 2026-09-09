import { toast } from "sonner"
import { newId } from "@/lib/ids"
import { getQueryClient } from "@/lib/query-client"
import { createSnacc, type CreateSnaccInput } from "../api"
import type { Snacc, SnaccAuthor } from "../types"
import {
  findSnacc,
  insertSnacc,
  patchSnacc,
  removeSnacc,
  replaceSnacc,
} from "."
import { toastError } from "@/features/premium/utils/limit-toast"
import {
  buildOptimisticSnacc,
  draftToInput,
  type SnaccDraft,
} from "./optimistic-snacc"

const inputs = new Map<string, CreateSnaccInput>()

const shiftComments = (by: number) => (snacc: Snacc) => ({
  ...snacc,
  comments_count: snacc.comments_count + by,
})

function shiftAncestors(parentId: string, by: number): void {
  const parent = patchSnacc(parentId, shiftComments(by))
  if (parent?.parent_id) patchSnacc(parent.parent_id, shiftComments(by))
}

export function submitSnacc(draft: SnaccDraft, author: SnaccAuthor): void {
  const id = newId()
  const input = draftToInput(id, draft)

  const optimistic = buildOptimisticSnacc(id, draft, author)
  insertSnacc(optimistic)
  if (optimistic.parent_id) shiftAncestors(optimistic.parent_id, 1)

  inputs.set(id, input)
  void send(id, input)
}

export function retrySnacc(id: string): void {
  const input = inputs.get(id)
  if (!input) return
  patchSnacc(id, (snacc) => ({ ...snacc, status: "sending" }))
  void send(id, input)
}

export function discardSnacc(id: string): void {
  const parentId = findSnacc(id)?.parent_id
  if (parentId) shiftAncestors(parentId, -1)
  inputs.delete(id)
  removeSnacc(id)
}

export function clearPendingSnaccs(): void {
  inputs.clear()
}

async function send(id: string, input: CreateSnaccInput): Promise<void> {
  const queryClient = getQueryClient()
  try {
    const real = await createSnacc(input)
    inputs.delete(id)

    if (real.held) {
      discardSnacc(id)
      toast.error("Hold on 👀", {
        description: "That post was flagged for review and not posted.",
      })
      return
    }

    replaceSnacc(id, real)
    queryClient.setQueryData(["snaccs", real.id], real)

    if (real.parent_id) {
      void queryClient.invalidateQueries({
        queryKey: ["snaccs", real.parent_id, "comments"],
        refetchType: "none",
      })
      void queryClient.invalidateQueries({
        queryKey: ["snaccs", real.parent_id],
        exact: true,
      })
    }
  } catch (error) {
    patchSnacc(id, (snacc) => ({ ...snacc, status: "failed" }))
    toastError(error)
  }
}
