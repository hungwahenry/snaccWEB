export function MomentInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (next: string) => void
  placeholder: string
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={1}
      autoFocus
      className="field-sizing-content min-h-32 w-full resize-none bg-transparent p-0 text-xl leading-7 font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
    />
  )
}
