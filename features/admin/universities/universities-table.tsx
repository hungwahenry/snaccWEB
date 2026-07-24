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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNaira, formatNumber } from "@/lib/format"
import type { useUniversityMutations } from "./use-universities"
import type { AdminUniversity } from "./types"

type Mutations = ReturnType<typeof useUniversityMutations>

function UniversityDialog({
  university,
  mutations,
  trigger,
}: {
  university?: AdminUniversity
  mutations: Mutations
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(university?.name ?? "")
  const [slug, setSlug] = useState(university?.slug ?? "")
  const [acronym, setAcronym] = useState(university?.acronym ?? "")
  const [motto, setMotto] = useState(university?.motto ?? "")
  const [website, setWebsite] = useState(university?.website ?? "")
  const [logoUrl, setLogoUrl] = useState(university?.logo_url ?? "")

  const editing = Boolean(university)
  const valid = editing
    ? name.trim() !== "" && acronym.trim() !== ""
    : name.trim() !== "" && slug.trim() !== "" && acronym.trim() !== ""

  function save() {
    const shared = {
      name: name.trim(),
      acronym: acronym.trim(),
      motto: motto.trim() || undefined,
      website: website.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
    }
    if (editing && university) {
      mutations.update.mutate({ id: university.id, input: shared }, { onSuccess: () => setOpen(false) })
    } else {
      mutations.create.mutate({ ...shared, slug: slug.trim() }, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit university" : "New university"}</DialogTitle>
        </DialogHeader>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input value={name} onChange={(event) => setName(event.target.value)} maxLength={200} />
        </Field>
        <div className="flex gap-3">
          {!editing && (
            <Field className="flex-1">
              <FieldLabel>Slug</FieldLabel>
              <Input value={slug} onChange={(event) => setSlug(event.target.value)} maxLength={100} />
            </Field>
          )}
          <Field className="flex-1">
            <FieldLabel>Acronym</FieldLabel>
            <Input
              value={acronym}
              onChange={(event) => setAcronym(event.target.value)}
              maxLength={20}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Motto (optional)</FieldLabel>
          <Input value={motto} onChange={(event) => setMotto(event.target.value)} maxLength={200} />
        </Field>
        <Field>
          <FieldLabel>Website (optional)</FieldLabel>
          <Input
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            maxLength={300}
          />
        </Field>
        <Field>
          <FieldLabel>Logo URL (optional)</FieldLabel>
          <Input
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
            maxLength={500}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={!valid || mutations.create.isPending || mutations.update.isPending}
            onClick={save}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDialog({
  university,
  mutations,
}: {
  university: AdminUniversity
  mutations: Mutations
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm">
            Delete
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {university.name}?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Only possible when no members or snaccs are attached to the campus.
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={mutations.remove.isPending}
            onClick={() => mutations.remove.mutate(university.id, { onSuccess: () => setOpen(false) })}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UniversitiesTable({
  universities,
  mutations,
}: {
  universities: AdminUniversity[]
  mutations: Mutations
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <UniversityDialog mutations={mutations} trigger={<Button size="sm">Add university</Button>} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>University</TableHead>
            <TableHead className="text-right">Members</TableHead>
            <TableHead className="text-right">Snaccs</TableHead>
            <TableHead>Fund</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {universities.map((university) => (
            <TableRow key={university.id}>
              <TableCell>
                <div className="font-medium">{university.name}</div>
                <div className="text-muted-foreground text-xs">
                  {university.acronym} · {university.slug}
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(university.stats.profiles)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(university.stats.snaccs)}
              </TableCell>
              <TableCell>
                {university.fund ? (
                  <Badge variant="secondary">{formatNaira(university.fund.cap)} cap</Badge>
                ) : (
                  <Badge variant="outline">free</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <UniversityDialog
                    university={university}
                    mutations={mutations}
                    trigger={
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  <DeleteDialog university={university} mutations={mutations} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
