"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AdminUserDetail } from "@/features/admin/users/types"
import { NamedIcon } from "@/lib/icons/named-icon"
import { useBadgeMutations, useBadges } from "./use-badges"

export function UserBadgesDialog({ user }: { user: AdminUserDetail }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("")
  const [note, setNote] = useState("")
  const catalog = useBadges()
  const mutations = useBadgeMutations()

  const held = new Set(user.badges.map((badge) => badge.id))
  const available = (catalog.data ?? []).filter((badge) => badge.is_active && !held.has(badge.id))

  function reset() {
    setSelected("")
    setNote("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Badges
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Badges</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Badges are worn beside this user&apos;s name in the app. They grant no permissions — use
          roles for that.
        </p>
        {user.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge) => (
              <Badge key={badge.id} variant="secondary" className="gap-1.5">
                <NamedIcon name={badge.icon} color={badge.color} className="size-3.5 shrink-0" />
                {badge.label}
                <button
                  type="button"
                  aria-label={`Revoke ${badge.label}`}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                  disabled={mutations.revoke.isPending}
                  onClick={() => mutations.revoke.mutate({ id: badge.id, userId: user.id })}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No badges granted.</p>
        )}
        {available.length > 0 && (
          <div className="flex flex-col gap-2">
            <Select value={selected} onValueChange={(value) => value && setSelected(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Add a badge…" />
              </SelectTrigger>
              <SelectContent>
                {available.map((badge) => (
                  <SelectItem key={badge.id} value={badge.id}>
                    {badge.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Why (optional, admin-only)"
                maxLength={200}
              />
              <Button
                size="sm"
                disabled={!selected || mutations.grant.isPending}
                onClick={() =>
                  selected &&
                  mutations.grant.mutate(
                    { id: selected, userId: user.id, note: note.trim() || undefined },
                    { onSuccess: reset },
                  )
                }
              >
                Grant
              </Button>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Done</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
