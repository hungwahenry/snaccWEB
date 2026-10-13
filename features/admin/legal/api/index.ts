import { api } from "@/lib/api/client"
import type {
  AdminLegalDocument,
  AdminLegalSummary,
  LegalDraft,
  NewVersionInput,
} from "../types"

export const listLegalDocuments = () =>
  api.get<AdminLegalSummary[]>("/admin/legal")

export const getLegalDocument = (id: string) =>
  api.get<AdminLegalDocument>(`/admin/legal/${id}`)

export const startLegalVersion = (input: NewVersionInput) =>
  api.post<AdminLegalDocument>("/admin/legal", input)

export const saveLegalDraft = (id: string, input: LegalDraft) =>
  api.patch<AdminLegalDocument>(`/admin/legal/${id}`, input)

export const publishLegalDraft = (id: string) =>
  api.post<AdminLegalDocument>(`/admin/legal/${id}/publish`)

export const deleteLegalDraft = (id: string) =>
  api.del<null>(`/admin/legal/${id}`)
