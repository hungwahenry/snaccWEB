export function FixPill({
  label,
  onPress,
}: {
  label: string
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="self-center rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground transition-opacity active:opacity-70"
    >
      {label}
    </button>
  )
}
