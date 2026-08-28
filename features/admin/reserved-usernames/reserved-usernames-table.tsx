"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { AdminReservedUsername } from "./index"

function HoldDialog({
  onHold,
  pending,
}: {
  onHold: (body: { name: string; reason: string }) => void
  pending: boolean
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [reason, setReason] = useState("")

  function save() {
    if (!name.trim() || !reason.trim()) return
    onHold({ name: name.trim().toLowerCase(), reason: reason.trim() })
    setName("")
    setReason("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">Hold a name</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hold a username</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Nobody will be able to take it. This only works on a name that is
          still free — if someone already has it, suspend the account instead.
        </p>
        <Field>
          <FieldLabel htmlFor="held-name">Username</FieldLabel>
          <Input
            id="held-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="snacchq"
            autoComplete="off"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="held-reason">Why</FieldLabel>
          <Input
            id="held-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Could be mistaken for Snacc itself"
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            onClick={save}
            disabled={pending || !name.trim() || !reason.trim()}
          >
            Hold it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ReleaseDialog({
  held,
  onRelease,
  pending,
}: {
  held: AdminReservedUsername
  onRelease: (name: string) => void
  pending: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm">
            Release
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-mono text-base">{held.name}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Held because: {held.reason}. Releasing it lets anyone register it, and
          it will not come back on the next deploy — this table is what is
          enforced.
        </p>
        {held.reason.toLowerCase().includes("route") ||
        held.reason.toLowerCase().includes("path") ? (
          <p className="text-sm">
            This one collides with a URL. Whoever takes it gets a profile page
            nobody can open, because the route wins.
          </p>
        ) : null}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Keep it held</Button>} />
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() => {
              onRelease(held.name)
              setOpen(false)
            }}
          >
            Release
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ReservedUsernamesTable({
  names,
  onHold,
  onRelease,
  pending,
}: {
  names: AdminReservedUsername[]
  onHold: (body: { name: string; reason: string }) => void
  onRelease: (name: string) => void
  pending: boolean
}) {
  const [filter, setFilter] = useState("")

  const shown = useMemo(() => {
    const needle = filter.trim().toLowerCase()
    if (!needle) return names
    return names.filter(
      (held) =>
        held.name.includes(needle) || held.reason.toLowerCase().includes(needle)
    )
  }, [names, filter])

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">{names.length} names held</CardTitle>
          <p className="text-sm text-muted-foreground">
            Every one can be released. Snacc seeds this list on a fresh install
            and never overrides it again.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter"
            className="w-44"
          />
          <HoldDialog onHold={onHold} pending={pending} />
        </div>
      </CardHeader>
      <CardContent>
        {shown.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing matches that.</p>
        ) : (
          <Table>
            <TableBody>
              {shown.map((held) => (
                <TableRow key={held.name}>
                  <TableCell className="w-56 font-mono text-sm">
                    {held.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {held.reason}
                  </TableCell>
                  <TableCell className="w-32">
                    {held.seeded ? null : (
                      <Badge variant="outline">added here</Badge>
                    )}
                  </TableCell>
                  <TableCell className="w-28 text-right">
                    <ReleaseDialog
                      held={held}
                      onRelease={onRelease}
                      pending={pending}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
