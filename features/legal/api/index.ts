import { api } from "@/lib/api/client"
import type { PendingDocuments } from "../types"

export const getPendingDocuments = () =>
  api.get<PendingDocuments>("/legal/pending")

export const acceptDocuments = (documentIds: string[]) =>
  api.post<null>("/legal/accept", { documentIds })
