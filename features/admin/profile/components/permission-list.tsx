import { Badge } from "@/components/ui/badge"

export function PermissionList({ groups }: { groups: [string, string[]][] }) {
  return (
    <div className="flex flex-col gap-3">
      {groups.map(([resource, actions]) => (
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
