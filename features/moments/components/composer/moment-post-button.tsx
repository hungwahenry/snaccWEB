import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function MomentPostButton({
  disabled,
  loading,
  onPress,
}: {
  disabled: boolean
  loading: boolean
  onPress: () => void
}) {
  return (
    <Button
      size="sm"
      className="h-10 px-5 font-extrabold"
      disabled={disabled || loading}
      onClick={onPress}
    >
      {loading ? <Spinner /> : "Share"}
    </Button>
  )
}
