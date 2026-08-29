"use client"

import { ConfirmAction } from "@/components/admin/confirm-action"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TableFrame } from "@/components/data-table/table-frame"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePermissions, useRoleMutations } from "../hooks/use-roles"
import type { AdminPermission, AdminRole } from "../types"

type Mutations = ReturnType<typeof useRoleMutations>

function RoleDialog({
  role,
  mutations,
  trigger,
}: {
  role?: AdminRole
  mutations: Mutations
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [slug, setSlug] = useState(role?.slug ?? "")
  const [name, setName] = useState(role?.name ?? "")
  const [description, setDescription] = useState(role?.description ?? "")

  const editing = Boolean(role)
  const valid = editing
    ? name.trim() !== ""
    : slug.trim() !== "" && name.trim() !== ""

  function save() {
    const meta = {
      name: name.trim(),
      description: description.trim() || undefined,
    }
    if (editing && role) {
      mutations.update.mutate(
        { id: role.id, input: meta },
        { onSuccess: () => setOpen(false) }
      )
    } else {
      mutations.create.mutate(
        { slug: slug.trim(), ...meta },
        { onSuccess: () => setOpen(false) }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit role" : "New role"}</DialogTitle>
        </DialogHeader>
        {!editing && (
          <Field>
            <FieldLabel>Slug</FieldLabel>
            <Input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="finance"
              maxLength={50}
            />
          </Field>
        )}
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Finance"
            maxLength={80}
          />
        </Field>
        <Field>
          <FieldLabel>Description (optional)</FieldLabel>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={200}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={
              !valid || mutations.create.isPending || mutations.update.isPending
            }
            onClick={save}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PermissionsDialog({
  role,
  catalog,
  mutations,
  trigger,
}: {
  role: AdminRole
  catalog: AdminPermission[]
  mutations: Mutations
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState<Set<string>>(
    new Set(role.permission_keys)
  )

  function onOpenChange(next: boolean) {
    // Re-seed the checklist from the role's current permissions each time it opens.
    if (next) setChecked(new Set(role.permission_keys))
    setOpen(next)
  }

  const grouped = useMemo(() => {
    const map = new Map<string, AdminPermission[]>()
    for (const permission of catalog) {
      const list = map.get(permission.resource) ?? []
      list.push(permission)
      map.set(permission.resource, list)
    }
    return [...map.entries()]
  }, [catalog])

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function save() {
    mutations.setPermissions.mutate(
      { id: role.id, keys: [...checked] },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Permissions · {role.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {grouped.map(([resource, permissions]) => (
            <div key={resource} className="flex flex-col gap-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase">
                {resource}
              </div>
              <div className="flex flex-col gap-1.5">
                {permissions.map((permission) => (
                  <button
                    key={permission.key}
                    type="button"
                    onClick={() => toggle(permission.key)}
                    className="flex items-center gap-2.5 text-left text-sm"
                  >
                    <Checkbox
                      checked={checked.has(permission.key)}
                      className="pointer-events-none"
                      tabIndex={-1}
                    />
                    <span className="font-mono text-xs">
                      {permission.action}
                    </span>
                    <span className="text-muted-foreground">
                      {permission.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button disabled={mutations.setPermissions.isPending} onClick={save}>
            Save permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function RolesTable({
  roles,
  mutations,
}: {
  roles: AdminRole[]
  mutations: Mutations
}) {
  const permissions = usePermissions()
  const catalog = permissions.data ?? []

  return (
    <TableFrame
      toolbar={
        <div className="flex justify-end">
          <RoleDialog
            mutations={mutations}
            trigger={<Button size="sm">New role</Button>}
          />
        </div>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Access</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                <div className="flex items-center gap-2 font-medium">
                  {role.name}
                  {role.is_system ? (
                    <Badge variant="outline">system</Badge>
                  ) : null}
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  {role.slug}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {role.allow_all
                  ? "Full access"
                  : `${role.permission_keys.length} permission${role.permission_keys.length === 1 ? "" : "s"}`}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {role.allow_all ? null : (
                    <PermissionsDialog
                      role={role}
                      catalog={catalog}
                      mutations={mutations}
                      trigger={
                        <Button variant="outline" size="sm">
                          Permissions
                        </Button>
                      }
                    />
                  )}
                  <RoleDialog
                    role={role}
                    mutations={mutations}
                    trigger={
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  {role.is_system ? null : (
                    <ConfirmAction
                      label="Delete"
                      variant="ghost"
                      title="Delete this role?"
                      description="Everyone holding it loses the access it granted, immediately."
                      confirmLabel="Delete role"
                      pending={mutations.remove.isPending}
                      onConfirm={(close) =>
                        mutations.remove.mutate(role.id, { onSuccess: close })
                      }
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  )
}
