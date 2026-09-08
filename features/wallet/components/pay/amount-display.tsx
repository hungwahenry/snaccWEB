function pretty(raw: string): string {
  if (!raw) return "0"
  const [whole, decimals] = raw.split(".")
  const grouped = Number(whole || "0").toLocaleString("en-NG")
  return decimals !== undefined ? `${grouped}.${decimals}` : grouped
}

function sizeFor(length: number): { amount: number; naira: number } {
  if (length <= 6) return { amount: 64, naira: 34 }
  if (length <= 9) return { amount: 52, naira: 28 }
  if (length <= 12) return { amount: 40, naira: 22 }
  return { amount: 32, naira: 18 }
}

export function AmountDisplay({ raw }: { raw: string }) {
  const value = pretty(raw)
  const size = sizeFor(value.length)

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
        {value}
      </span>
    </div>
  )
}
