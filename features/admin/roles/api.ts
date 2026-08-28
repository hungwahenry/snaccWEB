import { api } from "@/lib/api/client"
import type {
  AdminGrant,
  AdminPermission,
  AdminRole,
  CreateRoleInput,
  UpdateRoleInput,
} from "./types"

export function listRoles() {
  return api.get<AdminRole[]>("/admin/roles")
}

export function createRole(input: CreateRoleInput) {
  return api.post<AdminRole>("/admin/roles", input)
}

export function updateRole(id: string, input: UpdateRoleInput) {
  return api.patch<AdminRole>(`/admin/roles/${id}`, input)
}

export function setRolePermissions(id: string, keys: string[]) {
  return api.patch<AdminRole>(`/admin/roles/${id}/permissions`, { keys })
}

export function deleteRole(id: string) {
  return api.del<null>(`/admin/roles/${id}`)
}

export function listPermissions() {
  return api.get<AdminPermission[]>("/admin/permissions")
}

export function listUserRoles(userId: string) {
  return api.get<AdminGrant[]>(`/admin/users/${userId}/roles`)
}

export function grantRole(userId: string, roleId: string) {
  return api.post<AdminGrant>(`/admin/users/${userId}/roles`, { roleId })
}

export function revokeRole(userId: string, roleId: string) {
  return api.del<null>(`/admin/users/${userId}/roles/${roleId}`)
}
