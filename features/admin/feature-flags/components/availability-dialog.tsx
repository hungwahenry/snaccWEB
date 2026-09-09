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
import { Switch } from "@/components/ui/switch"
import { CanAct } from "@/features/admin/auth/components/can"
import { useFlagForm } from "../hooks/use-flag-form"
import type { AdminFeatureFlag, FlagChanges } from "../types"
import { PLATFORM_LABELS, PLATFORMS } from "../utils"

type UpdateInput = { key: string } & FlagChanges

function Form({
  flag,
  pending,
  onUpdate,
  onDone,
}: {
  flag: AdminFeatureFlag
  pending: boolean
  onUpdate: (input: UpdateInput) => void
  onDone: () => void
}) {
  const form = useFlagForm(flag)

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Which app builds this reaches. A build only changes when someone
        installs from a store, so an over-the-air update never moves anyone past
        these. Leave a field empty for no limit.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Oldest build</FieldLabel>
          <Input
            value={form.min}
            placeholder="1.2.0"
            onChange={(event) => form.setMin(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Newest build</FieldLabel>
          <Input
            value={form.max}
            placeholder="no limit"
            onChange={(event) => form.setMax(event.target.value)}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Platform rules</p>
          <p className="text-xs text-pretty text-muted-foreground">
            For when the stores fall out of step. A platform with its own rule
            ignores the builds above and follows this instead.
          </p>
        </div>

        {PLATFORMS.map((platform) => {
          const rule = form.rules[platform]

          return (
            <div
              key={platform}
              className="flex flex-col gap-3 border-t pt-3 first:border-t-0 first:pt-0"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">{PLATFORM_LABELS[platform]}</span>
                <Switch
                  checked={Boolean(rule)}
                  onCheckedChange={(wanted) =>
                    form.toggleRule(platform, wanted)
                  }
                />
              </div>

              {rule ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      On for {PLATFORM_LABELS[platform]}
                    </span>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(enabled) =>
                        form.editRule(platform, { enabled })
                      }
                    />
                  </div>

                  {platform === "web" ? (
                    <p className="text-xs text-muted-foreground">
                      The web ships continuously, so there is no build to limit.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={rule.min}
                        placeholder="oldest build"
                        onChange={(event) =>
                          form.editRule(platform, { min: event.target.value })
                        }
                      />
                      <Input
                        value={rule.max}
                        placeholder="newest build"
                        onChange={(event) =>
                          form.editRule(platform, { max: event.target.value })
                        }
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Anything that doesn&apos;t say which build it is gets treated as too old
        and won&apos;t see the feature.
      </p>

      <DialogFooter>
        <DialogClose render={<Button variant="ghost">Cancel</Button>} />
        <Button
          disabled={pending}
          onClick={() => {
            onUpdate({ key: flag.key, ...form.changes() })
            onDone()
          }}
        >
          Save
        </Button>
      </DialogFooter>
    </>
  )
}

export function AvailabilityDialog({
  flag,
  onUpdate,
  pending,
}: {
  flag: AdminFeatureFlag
  onUpdate: (input: UpdateInput) => void
  pending: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <CanAct permission="flags.write">
        <DialogTrigger
          render={
            <Button variant="outline" size="sm">
              Availability
            </Button>
          }
        />
      </CanAct>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{flag.key}</DialogTitle>
        </DialogHeader>
        {/* Mounted only while open, so it always opens on what is actually saved. */}
        {open ? (
          <Form
            flag={flag}
            pending={pending}
            onUpdate={onUpdate}
            onDone={() => setOpen(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
