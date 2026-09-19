import { ProgressRing } from "@/components/ui/progress-ring"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <ProgressRing progress={null} size="lg" label="Loading clips" />
    </div>
  )
}
