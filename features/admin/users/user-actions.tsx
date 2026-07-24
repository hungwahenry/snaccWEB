"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { formatNaira } from "@/lib/format"
import type { useUserMutations } from "./use-users"
import type { AdminUserDetail } from "./types"

type Mutations = ReturnType<typeof useUserMutations>

function SuspendDialog({ actions }: { actions: Mutations }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")

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
        <p className="text-muted-foreground text-sm">
          The account is signed out and blocked from the app until reinstated.
        </p>
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
            disabled={actions.suspend.isPending}
            onClick={() =>
              actions.suspend.mutate(reason.trim() || undefined, {
                onSuccess: () => setOpen(false),
              })
            }
          >
            Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RoleDialog({ user, actions }: { user: AdminUserDetail; actions: Mutations }) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState(user.role)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Change role
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
        </DialogHeader>
        <Field>
          <FieldLabel>Role</FieldLabel>
          <Select value={role} onValueChange={(value) => value && setRole(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={actions.changeRole.isPending || role === user.role}
            onClick={() => actions.changeRole.mutate(role, { onSuccess: () => setOpen(false) })}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function BalanceDialog({ user, actions }: { user: AdminUserDetail; actions: Mutations }) {
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
        <p className="text-muted-foreground text-sm">
          Off-ledger credit or debit. Use a negative amount to debit. Current balance{" "}
          {formatNaira(user.balance)}.
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
            New balance: <span className="font-medium tabular-nums">{formatNaira(preview)}</span>
          </p>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={!valid || actions.balance.isPending}
            onClick={() =>
              actions.balance.mutate(
                { delta, reason: reason.trim() || undefined },
                { onSuccess: () => setOpen(false) },
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

function DeleteDialog({ user, actions }: { user: AdminUserDetail; actions: Mutations }) {
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
        <p className="text-muted-foreground text-sm">
          This permanently removes the account and all its content. Type{" "}
          <span className="text-foreground font-medium">{user.email}</span> to confirm.
        </p>
        <Field>
          <FieldLabel>Confirm email</FieldLabel>
          <Input value={confirm} onChange={(event) => setConfirm(event.target.value)} />
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

export function UserActions({ user, actions }: { user: AdminUserDetail; actions: Mutations }) {
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
      <RoleDialog user={user} actions={actions} />
      <BalanceDialog user={user} actions={actions} />
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
