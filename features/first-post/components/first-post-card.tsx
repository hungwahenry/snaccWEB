import { FirstPostComposer } from "./first-post-composer"

export function FirstPostCard({ onPosted }: { onPosted: () => void }) {
  return (
    <div className="mx-4 mt-3 mb-1 flex flex-col gap-4 rounded-3xl border border-border p-5">
      <div>
        <p className="text-xl font-extrabold text-foreground">
          Don&apos;t be shy 😏
        </p>
        <p className="text-sm text-muted-foreground">
          Your campus is listening... drop your first snacc.
        </p>
      </div>

      <FirstPostComposer onPosted={onPosted} />
    </div>
  )
}
