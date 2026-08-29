"use client"

import { ConfirmAction } from "@/components/admin/confirm-action"

import { useState } from "react"
import { TableFrame } from "@/components/data-table/table-frame"
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
import type { AdminUniversity } from "@/features/admin/universities/types"
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
      }
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
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
          />
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
            <Select
              value={audience}
              onValueChange={(value) => value && setAudience(value as never)}
            >
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
              <Select
                value={universityId}
                onValueChange={(value) => value && setUniversityId(value)}
              >
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
          <Button
            disabled={!valid || mutations.create.isPending}
            onClick={submit}
          >
            Broadcast
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AnnouncementsTable({
  data,
  onParams,
  universities,
  mutations,
}: {
  data: Paginated<AdminAnnouncement>
  onParams: (patch: Partial<ListAnnouncementsParams>) => void
  universities: AdminUniversity[]
  mutations: Mutations
}) {
  const campusName = (id: string | null) =>
    id
      ? (universities.find((university) => university.id === id)?.acronym ??
        "campus")
      : "Everyone"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <BroadcastDialog universities={universities} mutations={mutations} />
      </div>
      <TableFrame
        page={data.page}
        perPage={data.per_page}
        total={data.total}
        onPageChange={(page) => onParams({ page })}
      >
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
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No announcements yet.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="max-w-md">
                    <div className="font-medium">{announcement.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {announcement.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        announcement.university_id ? "secondary" : "outline"
                      }
                    >
                      {campusName(announcement.university_id)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(announcement.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmAction
                      label="Delete"
                      variant="ghost"
                      title="Delete this announcement?"
                      description="It disappears from everyone's notifications. Pushes already sent cannot be taken back."
                      confirmLabel="Delete announcement"
                      pending={mutations.remove.isPending}
                      onConfirm={(close) =>
                        mutations.remove.mutate(announcement.id, {
                          onSuccess: close,
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableFrame>
    </div>
  )
}
