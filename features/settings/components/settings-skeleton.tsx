import { Skeleton } from "@/components/ui/skeleton"

const SECTIONS = [2, 3, 2, 2]

export function SettingsSkeleton() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <div className="flex flex-col gap-5 px-6 py-6">
        {SECTIONS.map((rows, section) => (
          <div key={section} className="flex flex-col gap-1">
            <Skeleton className="mb-2 h-3 w-24" />
            {Array.from({ length: rows }, (_, row) => (
              <div key={row} className="flex items-center gap-3 py-3.5">
                <Skeleton className="size-5 rounded-md" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
