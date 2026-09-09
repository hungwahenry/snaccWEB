import { Badge } from "@/components/ui/badge"

/// Grouped by resource, because 77 flat keys tells you nothing about what you can reach.
export function PermissionList({ keys }: { keys: string[] }) {
  const byResource = new Map<string, string[]>()
  for (const key of [...keys].sort()) {
    const [resource, action] = key.split(".")
    byResource.set(resource, [...(byResource.get(resource) ?? []), action])
  }

  return (
    <div className="flex flex-col gap-3">
      {[...byResource].map(([resource, actions]) => (
        <div key={resource} className="flex flex-wrap items-center gap-2">
          <span className="w-44 shrink-0 font-mono text-xs text-muted-foreground">
            {resource}
          </span>
          {actions.map((action) => (
            <Badge key={action} variant="outline" className="font-mono text-xs">
              {action}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  )
}
