"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
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
        <p className="text-muted-foreground text-sm">
          Nobody will be able to take it. This only works on a name that is still free — if someone
          already has it, suspend the account instead.
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={pending || !name.trim() || !reason.trim()}>
            Hold it
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
  const added = names.filter((held) => !held.seeded)
  const shipped = names.filter((held) => held.seeded)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Held by hand</CardTitle>
            <p className="text-muted-foreground text-sm">
              Added here, and kept through every deploy.
            </p>
          </div>
          <HoldDialog onHold={onHold} pending={pending} />
        </CardHeader>
        <CardContent>
          {added.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              None yet. Everything below ships with Snacc.
            </p>
          ) : (
            <Table>
              <TableBody>
                {added.map((held) => (
                  <TableRow key={held.name}>
                    <TableCell className="font-mono text-sm">{held.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{held.reason}</TableCell>
                    <TableCell className="w-28 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={pending}
                        onClick={() => onRelease(held.name)}
                      >
                        Release
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ships with Snacc</CardTitle>
          <p className="text-muted-foreground text-sm">
            Routes a profile URL would collide with, names Snacc would speak under, and
            infrastructure paths. Releasing one here would only free it until the next deploy put it
            back, so they are changed in the manifest instead.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {shipped.map((held) => (
              <Badge key={held.name} variant="secondary" className="font-mono font-normal">
                {held.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
