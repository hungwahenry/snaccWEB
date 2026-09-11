import { amountSize, groupAmount } from "../../utils/amount"

export function AmountDisplay({ raw }: { raw: string }) {
  const shown = groupAmount(raw)
  const size = amountSize(shown)

  return (
    <div className="flex items-start justify-center px-8">
      <span
        className="font-extrabold text-foreground"
        style={{
          fontSize: size.naira,
          lineHeight: 1.1,
          marginTop: size.amount * 0.12,
        }}
      >
        ₦
      </span>
      <span
        className="truncate font-extrabold text-foreground tabular-nums"
        style={{ fontSize: size.amount, lineHeight: 1.15 }}
      >
        {shown}
      </span>
    </div>
  )
}
