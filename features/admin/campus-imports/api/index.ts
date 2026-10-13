import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AppliedImport,
  CampusImport,
  CampusImportListQuery,
  CampusImportRow,
  CampusImportRowEdit,
  CampusImportRowQuery,
  NewCampusImport,
} from "../types"

export function listCampusImports(query: CampusImportListQuery) {
  return api.get<Paginated<CampusImport>>("/admin/campus-imports", query)
}

export function getCampusImport(id: string) {
  return api.get<CampusImport>(`/admin/campus-imports/${id}`)
}

export function listCampusImportRows(id: string, query: CampusImportRowQuery) {
  return api.get<Paginated<CampusImportRow>>(
    `/admin/campus-imports/${id}/rows`,
    query
  )
}

export function importCampuses(input: NewCampusImport) {
  return api.post<CampusImport>("/admin/campus-imports", input)
}

export function checkCountryCampuses(countryCode: string) {
  return api.post<CampusImport>("/admin/campus-imports/country", {
    countryCode,
  })
}

export function editCampusImportRow(
  id: string,
  rowId: string,
  edit: CampusImportRowEdit
) {
  return api.patch<CampusImportRow>(
    `/admin/campus-imports/${id}/rows/${rowId}`,
    edit
  )
}

export function recheckCampusImport(id: string) {
  return api.post<CampusImport>(`/admin/campus-imports/${id}/check`)
}

export function applyCampusImport(id: string) {
  return api.post<AppliedImport>(`/admin/campus-imports/${id}/apply`)
}

export function discardCampusImport(id: string) {
  return api.del<null>(`/admin/campus-imports/${id}`)
}
