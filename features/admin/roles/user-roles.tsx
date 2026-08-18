"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useRoles } from "./use-roles"
import { useGrantMutations, useUserRoles } from "./use-user-roles"

export function UserRoles({ userId }: { userId: string }) {
  const grants = useUserRoles(userId)
  const roles = useRoles()
  const mutations = useGrantMutations(userId)
  const [selected, setSelected] = useState<string>("")

  const held = new Set((grants.data ?? []).map((grant) => grant.role.id))
  const available = (roles.data ?? []).filter((role) => !held.has(role.id))

  function grant() {
    if (!selected) return
    mutations.grant.mutate(selected, { onSuccess: () => setSelected("") })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {grants.isPending ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : grants.data && grants.data.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {grants.data.map((grant) => (
              <Badge key={grant.id} variant="secondary" className="gap-1.5">
                {grant.role.name}
                <button
                  type="button"
                  aria-label={`Revoke ${grant.role.name}`}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                  disabled={mutations.revoke.isPending}
                  onClick={() => mutations.revoke.mutate(grant.role.id)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No roles granted.</p>
        )}

        {available.length > 0 ? (
          <div className="flex items-center gap-2">
            <Select value={selected} onValueChange={(value) => value && setSelected(value)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Add a role…" />
              </SelectTrigger>
              <SelectContent>
                {available.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" disabled={!selected || mutations.grant.isPending} onClick={grant}>
              Grant
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
