"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { AdminFeatureFlag } from "./index"

export function FlagsTable({
  flags,
  onToggle,
  pending,
}: {
  flags: AdminFeatureFlag[]
  onToggle: (input: { key: string; enabled: boolean }) => void
  pending: boolean
}) {
  const categories = [...new Set(flags.map((f) => f.category))].sort()

  return (
    <div className="flex flex-col gap-6">
      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {flags
              .filter((f) => f.category === category)
              .map((flag) => (
                <div key={flag.key} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <div className="font-mono text-xs">{flag.key}</div>
                    <div className="text-muted-foreground mt-0.5 text-xs">{flag.description}</div>
                  </div>
                  <Switch
                    checked={flag.enabled}
                    disabled={pending}
                    onCheckedChange={(enabled) => onToggle({ key: flag.key, enabled })}
                  />
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
