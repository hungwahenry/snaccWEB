import { prettyJson } from "../utils/json"

export function JsonBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <pre className="max-h-80 overflow-auto rounded-lg bg-muted p-3 font-mono text-xs">
        {value === null || value === undefined ? "—" : prettyJson(value)}
      </pre>
    </div>
  )
}
