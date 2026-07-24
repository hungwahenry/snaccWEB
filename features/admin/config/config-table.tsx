"use client"

import { useState } from "react"
import { toast } from "sonner"
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
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import type { AdminConfigSetting } from "./index"

type UpdateInput = { key: string; body: { value?: unknown; isPublic?: boolean } }

function display(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value)
}

function EditDialog({
  setting,
  onUpdate,
  pending,
}: {
  setting: AdminConfigSetting
  onUpdate: (input: UpdateInput) => void
  pending: boolean
}) {
  const [open, setOpen] = useState(false)
  const isBool = typeof setting.value === "boolean"
  const isNum = typeof setting.value === "number"
  const isComplex = typeof setting.value === "object" && setting.value !== null
  const [text, setText] = useState(
    isComplex ? JSON.stringify(setting.value, null, 2) : String(setting.value),
  )
  const [bool, setBool] = useState(Boolean(setting.value))
  const [isPublic, setIsPublic] = useState(setting.is_public)

  function save() {
    let value: unknown
    if (isBool) value = bool
    else if (isNum) value = Number(text)
    else if (isComplex) {
      try {
        value = JSON.parse(text)
      } catch {
        toast.error("Value is not valid JSON.")
        return
      }
    } else value = text
    onUpdate({ key: setting.key, body: { value, isPublic } })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Edit
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{setting.key}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">{setting.description}</p>
        <Field>
          <FieldLabel>Value</FieldLabel>
          {isBool ? (
            <Switch checked={bool} onCheckedChange={setBool} />
          ) : isComplex ? (
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={6}
              className="font-mono text-xs"
            />
          ) : (
            <Input
              type={isNum ? "number" : "text"}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          )}
        </Field>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Public (served to clients)</span>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={pending}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ConfigTable({
  settings,
  onUpdate,
  pending,
}: {
  settings: AdminConfigSetting[]
  onUpdate: (input: UpdateInput) => void
  pending: boolean
}) {
  const categories = [...new Set(settings.map((s) => s.category))].sort()

  return (
    <div className="flex flex-col gap-6">
      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {settings
                  .filter((s) => s.category === category)
                  .map((setting) => (
                    <TableRow key={setting.key}>
                      <TableCell className="align-top">
                        <div className="font-mono text-xs">{setting.key}</div>
                        <div className="text-muted-foreground mt-1 text-xs">{setting.description}</div>
                      </TableCell>
                      <TableCell className="align-top">
                        <code className="text-xs">{display(setting.value)}</code>
                      </TableCell>
                      <TableCell className="align-top">
                        {setting.is_public ? (
                          <Badge variant="secondary">public</Badge>
                        ) : (
                          <Badge variant="outline">private</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <EditDialog setting={setting} onUpdate={onUpdate} pending={pending} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
