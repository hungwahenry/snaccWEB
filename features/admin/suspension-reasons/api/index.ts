import { api } from "@/lib/api/client"
import type {
  CreateSuspensionReasonInput,
  SuspensionReason,
  UpdateSuspensionReasonInput,
} from "../types"

export function listSuspensionReasons() {
  return api.get<SuspensionReason[]>("/admin/suspension-reasons")
}

export function createSuspensionReason(input: CreateSuspensionReasonInput) {
  return api.post<SuspensionReason>("/admin/suspension-reasons", input)
}

export function updateSuspensionReason(
  id: string,
  input: UpdateSuspensionReasonInput
) {
  return api.patch<SuspensionReason>(`/admin/suspension-reasons/${id}`, input)
}
