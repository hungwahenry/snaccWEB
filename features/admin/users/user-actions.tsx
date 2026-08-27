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
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useRoles } from "@/features/admin/roles/use-roles"
import {
  EMPTY_SUSPENSION,
  SuspensionFields,
  toSuspensionInput,
} from "@/features/admin/suspension-reasons/suspension-fields"
import {
  useGrantMutations,
  useUserRoles,
} from "@/features/admin/roles/use-user-roles"
import { formatNaira } from "@/lib/format"
import type { useUserMutations } from "./use-users"
import type { AdminUserDetail } from "./types"

type Mutations = ReturnType<typeof useUserMutations>

function SuspendDialog({ actions }: { actions: Mutations }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(EMPTY_SUSPENSION)
  const [note, setNote] = useState("")

  function submit() {
    actions.suspend.mutate(toSuspensionInput(draft, note), {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Suspend
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend user</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          They keep their session but can only reach the screen explaining this.
          A timed suspension lifts itself.
        </p>
        <SuspensionFields value={draft} onChange={setDraft} />
        <Field>
          <FieldLabel>Internal note (optional)</FieldLabel>
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Never shown to the user."
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button disabled={actions.suspend.isPending} onClick={submit}>
            Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RolesDialog({ user }: { user: AdminUserDetail }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("")
  const grants = useUserRoles(user.id)
  const roles = useRoles()
  const mutations = useGrantMutations(user.id)

  const held = new Set((grants.data ?? []).map((grant) => grant.role.id))
  const available = (roles.data ?? []).filter((role) => !held.has(role.id))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Roles
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Roles</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Grant or revoke roles. What a user can do is set by the permissions
          each role carries.
        </p>
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
          <p className="text-sm text-muted-foreground">No roles granted.</p>
        )}
        {available.length > 0 && (
          <div className="flex items-center gap-2">
            <Select
              value={selected}
              onValueChange={(value) => value && setSelected(value)}
            >
              <SelectTrigger className="flex-1">
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
            <Button
              size="sm"
              disabled={!selected || mutations.grant.isPending}
              onClick={() =>
                selected &&
                mutations.grant.mutate(selected, {
                  onSuccess: () => setSelected(""),
                })
              }
            >
              Grant
            </Button>
          </div>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Done</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function BalanceDialog({
  user,
  actions,
}: {
  user: AdminUserDetail
  actions: Mutations
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")

  const naira = Number(amount)
  const valid = amount.trim() !== "" && Number.isFinite(naira) && naira !== 0
  const delta = Math.round(naira * 100)
  const preview = valid ? user.balance + delta : user.balance

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Adjust balance
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust balance</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Off-ledger credit or debit. Use a negative amount to debit. Current
          balance {formatNaira(user.balance)}.
        </p>
        <Field>
          <FieldLabel>Amount (₦, negative to debit)</FieldLabel>
          <Input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0"
          />
        </Field>
        <Field>
          <FieldLabel>Reason</FieldLabel>
          <Input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={200}
          />
        </Field>
        {valid && (
          <p className="text-sm">
            New balance:{" "}
            <span className="font-medium tabular-nums">
              {formatNaira(preview)}
            </span>
          </p>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={!valid || actions.balance.isPending}
            onClick={() =>
              actions.balance.mutate(
                { delta, reason: reason.trim() || undefined },
                { onSuccess: () => setOpen(false) }
              )
            }
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDialog({
  user,
  actions,
}: {
  user: AdminUserDetail
  actions: Mutations
}) {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete user</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This permanently removes the account and all its content. Type{" "}
          <span className="font-medium text-foreground">{user.email}</span> to
          confirm.
        </p>
        <Field>
          <FieldLabel>Confirm email</FieldLabel>
          <Input
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={confirm.trim() !== user.email || actions.remove.isPending}
            onClick={() => actions.remove.mutate(confirm.trim())}
          >
            Delete permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ReasonDialog({
  triggerLabel,
  title,
  description,
  confirmLabel,
  pending,
  onConfirm,
}: {
  triggerLabel: string
  title: string
  description: string
  confirmLabel: string
  pending: boolean
  onConfirm: (reason: string | undefined, close: () => void) => void
}) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            {triggerLabel}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Field>
          <FieldLabel>Reason (optional)</FieldLabel>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            maxLength={500}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={pending}
            onClick={() =>
              onConfirm(reason.trim() || undefined, () => setOpen(false))
            }
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Same shape as ReasonDialog, without a reason field the endpoint would only discard. */
function ConfirmDialog({
  triggerLabel,
  title,
  description,
  confirmLabel,
  pending,
  onConfirm,
}: {
  triggerLabel: string
  title: string
  description: string
  confirmLabel: string
  pending: boolean
  onConfirm: (close: () => void) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            {triggerLabel}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{description}</p>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={pending}
            onClick={() => onConfirm(() => setOpen(false))}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UserActions({
  user,
  actions,
}: {
  user: AdminUserDetail
  actions: Mutations
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {user.suspended_at ? (
        <Button
          variant="outline"
          size="sm"
          disabled={actions.unsuspend.isPending}
          onClick={() => actions.unsuspend.mutate()}
        >
          Reinstate
        </Button>
      ) : (
        <SuspendDialog actions={actions} />
      )}
      <RolesDialog user={user} />
      <BalanceDialog user={user} actions={actions} />
      {user.posts_globally ? (
        <Button
          variant="outline"
          size="sm"
          disabled={actions.makeCampusBound.isPending}
          onClick={() => actions.makeCampusBound.mutate()}
        >
          Stop posting everywhere
        </Button>
      ) : (
        <ConfirmDialog
          triggerLabel="Post to every campus"
          title="Post to every campus?"
          description="This account's snaccs will appear on every campus feed, not just its own. It stops earning, because an account that posts everywhere would otherwise out-earn every campus. Snaccs it has already posted move with it."
          confirmLabel="Post everywhere"
          pending={actions.makeGlobal.isPending}
          onConfirm={(close: () => void) =>
            actions.makeGlobal.mutate(undefined, { onSuccess: close })
          }
        />
      )}
      {user.earnings_paused_at ? (
        <Button
          variant="outline"
          size="sm"
          disabled={actions.resumeEarnings.isPending}
          onClick={() => actions.resumeEarnings.mutate()}
        >
          Resume earnings
        </Button>
      ) : (
        <ReasonDialog
          triggerLabel="Pause earnings"
          title="Pause earnings"
          description="Stops new earning credits for this user. Their account stays fully active."
          confirmLabel="Pause earnings"
          pending={actions.pauseEarnings.isPending}
          onConfirm={(reason, close) =>
            actions.pauseEarnings.mutate(reason, { onSuccess: close })
          }
        />
      )}
      {user.payouts_blocked_at ? (
        <Button
          variant="outline"
          size="sm"
          disabled={actions.unblockPayouts.isPending}
          onClick={() => actions.unblockPayouts.mutate()}
        >
          Unblock payouts
        </Button>
      ) : (
        <ReasonDialog
          triggerLabel="Block payouts"
          title="Block payouts"
          description="Stops this user from withdrawing. Their balance stays intact."
          confirmLabel="Block payouts"
          pending={actions.blockPayouts.isPending}
          onConfirm={(reason, close) =>
            actions.blockPayouts.mutate(reason, { onSuccess: close })
          }
        />
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={actions.revoke.isPending}
        onClick={() => actions.revoke.mutate()}
      >
        Revoke sessions
      </Button>
      <DeleteDialog user={user} actions={actions} />
    </div>
  )
}
