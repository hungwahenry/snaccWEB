import { Input } from "@/components/ui/input"
import { OptionSelect } from "@/components/ui/option-select"

export function ButtonFields({
  value,
  options,
  link,
  onPick,
  onLink,
}: {
  value: string
  options: { value: string; label: string }[]
  link: string
  onPick: (value: string) => void
  onLink: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <OptionSelect
        label="It says"
        value={value}
        options={options}
        onChange={onPick}
      />
      {value ? (
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            It opens
          </span>
          <Input
            type="url"
            inputMode="url"
            value={link}
            onChange={(event) => onLink(event.target.value)}
            placeholder="https://"
            autoCorrect="off"
            autoCapitalize="off"
            className="h-11 rounded-full px-4 text-sm md:text-sm"
          />
        </label>
      ) : null}
    </div>
  )
}
