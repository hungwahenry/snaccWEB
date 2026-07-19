"use client"

import { useState } from "react"
import { DataPagination } from "@/components/data-pagination"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import type { AdminUniversity } from "@/features/universities/types"
import type { useAnnouncementMutations } from "./use-announcements"
import type { AdminAnnouncement, ListAnnouncementsParams } from "./types"

type Mutations = ReturnType<typeof useAnnouncementMutations>

function BroadcastDialog({
  universities,
  mutations,
}: {
  universities: AdminUniversity[]
  mutations: Mutations
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState<"all" | "campus">("all")
  const [universityId, setUniversityId] = useState("")

  const valid =
    title.trim() !== "" &&
    message.trim() !== "" &&
    (audience === "all" || universityId !== "")

  function submit() {
    mutations.create.mutate(
      {
        title: title.trim(),
        message: message.trim(),
        audience,
        universityId: audience === "campus" ? universityId : undefined,
      },
      {
        onSuccess: () => {
          setOpen(false)
          setTitle("")
          setMessage("")
          setAudience("all")
          setUniversityId("")
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">New announcement</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Broadcast announcement</DialogTitle>
        </DialogHeader>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} />
        </Field>
        <Field>
          <FieldLabel>Message</FieldLabel>
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            maxLength={1000}
          />
        </Field>
        <div className="flex gap-3">
          <Field className="flex-1">
            <FieldLabel>Audience</FieldLabel>
            <Select value={audience} onValueChange={(value) => value && setAudience(value as never)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Everyone</SelectItem>
                <SelectItem value="campus">One campus</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {audience === "campus" && (
            <Field className="flex-1">
              <FieldLabel>Campus</FieldLabel>
              <Select value={universityId} onValueChange={(value) => value && setUniversityId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((university) => (
                    <SelectItem key={university.id} value={university.id}>
                      {university.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button disabled={!valid || mutations.create.isPending} onClick={submit}>
            Broadcast
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AnnouncementsTable({
  data,
  params,
  onParams,
  universities,
  mutations,
}: {
  data: Paginated<AdminAnnouncement>
  params: ListAnnouncementsParams
  onParams: (patch: Partial<ListAnnouncementsParams>) => void
  universities: AdminUniversity[]
  mutations: Mutations
}) {
  const campusName = (id: string | null) =>
    id ? (universities.find((university) => university.id === id)?.acronym ?? "campus") : "Everyone"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <BroadcastDialog universities={universities} mutations={mutations} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead>Sent</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground py-10 text-center text-sm">
                No announcements yet.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell className="max-w-md">
                  <div className="font-medium">{announcement.title}</div>
                  <div className="text-muted-foreground truncate text-xs">
                    {announcement.message}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={announcement.university_id ? "secondary" : "outline"}>
                    {campusName(announcement.university_id)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(announcement.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={mutations.remove.isPending}
                    onClick={() => mutations.remove.mutate(announcement.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <DataPagination
        page={data.page}
        lastPage={data.last_page}
        total={data.total}
        onPage={(page) => onParams({ page })}
      />
    </div>
  )
}
