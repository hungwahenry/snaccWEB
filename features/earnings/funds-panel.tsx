"use client"

import { useMemo, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNaira } from "@/lib/format"
import type { AdminUniversity } from "@/features/universities/types"
import type { useFundMutations } from "./use-earnings"
import type { AdminFund } from "./types"

type Mutations = ReturnType<typeof useFundMutations>

function ProvisionDialog({
  universities,
  funds,
  mutations,
}: {
  universities: AdminUniversity[]
  funds: AdminFund[]
  mutations: Mutations
}) {
  const [open, setOpen] = useState(false)
  const [universityId, setUniversityId] = useState("")
  const [cap, setCap] = useState("")

  const available = useMemo(() => {
    const funded = new Set(funds.map((fund) => fund.university_id))
    return universities.filter((university) => !funded.has(university.id))
  }, [universities, funds])

  const naira = Number(cap)
  const valid = universityId !== "" && Number.isFinite(naira) && naira >= 0 && cap.trim() !== ""

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">Provision fund</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Provision campus fund</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Creating a fund switches the campus into paid mode.
        </p>
        <Field>
          <FieldLabel>Campus</FieldLabel>
          <Select value={universityId} onValueChange={(value) => value && setUniversityId(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a campus" />
            </SelectTrigger>
            <SelectContent>
              {available.map((university) => (
                <SelectItem key={university.id} value={university.id}>
                  {university.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Cap (₦)</FieldLabel>
          <Input type="number" value={cap} onChange={(event) => setCap(event.target.value)} />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={!valid || mutations.provision.isPending}
            onClick={() =>
              mutations.provision.mutate(
                { universityId, cap: Math.round(naira * 100) },
                { onSuccess: () => setOpen(false) },
              )
            }
          >
            Provision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AdjustDialog({ fund, mutations }: { fund: AdminFund; mutations: Mutations }) {
  const [open, setOpen] = useState(false)
  const [cap, setCap] = useState(String(fund.cap / 100))

  const naira = Number(cap)
  const valid = Number.isFinite(naira) && naira >= 0 && cap.trim() !== ""

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Adjust cap
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fund.university.name}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Distributed so far {formatNaira(fund.distributed)}.
        </p>
        <Field>
          <FieldLabel>Cap (₦)</FieldLabel>
          <Input type="number" value={cap} onChange={(event) => setCap(event.target.value)} />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={!valid || mutations.adjust.isPending}
            onClick={() =>
              mutations.adjust.mutate(
                { universityId: fund.university_id, cap: Math.round(naira * 100) },
                { onSuccess: () => setOpen(false) },
              )
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function FundsPanel({
  funds,
  universities,
  mutations,
}: {
  funds: AdminFund[]
  universities: AdminUniversity[]
  mutations: Mutations
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Campus funds</CardTitle>
        <ProvisionDialog universities={universities} funds={funds} mutations={mutations} />
      </CardHeader>
      <CardContent>
        {funds.length === 0 ? (
          <p className="text-muted-foreground text-sm">No campus is in paid mode yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campus</TableHead>
                <TableHead className="text-right">Cap</TableHead>
                <TableHead className="text-right">Distributed</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funds.map((fund) => (
                <TableRow key={fund.university_id}>
                  <TableCell className="font-medium">{fund.university.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNaira(fund.cap)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNaira(fund.distributed)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNaira(fund.cap - fund.distributed)}
                  </TableCell>
                  <TableCell className="text-right">
                    <AdjustDialog fund={fund} mutations={mutations} />
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
