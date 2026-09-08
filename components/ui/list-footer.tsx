import { Spinner } from "@/components/ui/spinner"

export function ListFooter({ loading }: { loading: boolean }) {
  if (!loading) return null

  return (
    <div className="flex items-center justify-center py-6">
      <Spinner className="size-5 text-muted-foreground" />
    </div>
  )
}
