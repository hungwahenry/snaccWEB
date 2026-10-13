export interface Money {
  amount: number
  currency: string
}

function formatter(currency: string, digits?: number): Intl.NumberFormat {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    ...(digits === undefined
      ? {}
      : { minimumFractionDigits: digits, maximumFractionDigits: digits }),
  })
}

export function minorDigits(currency: string): number {
  return formatter(currency).resolvedOptions().maximumFractionDigits ?? 2
}

export function money(amount: number, currency: string): Money {
  return { amount, currency }
}

function same(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot combine ${a.currency} with ${b.currency}.`)
  }
}

export function addMoney(a: Money, b: Money): Money {
  same(a, b)
  return money(a.amount + b.amount, a.currency)
}

export function subtractMoney(a: Money, b: Money): Money {
  same(a, b)
  return money(a.amount - b.amount, a.currency)
}

export function formatMoney(value: Money): string {
  const digits = minorDigits(value.currency)
  const unit = 10 ** digits
  const whole = value.amount % unit === 0

  return formatter(value.currency, whole ? 0 : digits).format(
    value.amount / unit
  )
}

export function formatTotals(totals: Money[]): string {
  return totals.length === 0 ? "—" : totals.map(formatMoney).join(" · ")
}

export function currencySymbol(currency: string): string {
  return (
    formatter(currency, 0)
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency
  )
}

export function moneyToInput(value: Money): string {
  const digits = minorDigits(value.currency)
  const unit = 10 ** digits
  const whole = Math.floor(value.amount / unit)
  const minor = value.amount % unit
  return minor === 0
    ? String(whole)
    : `${whole}.${String(minor).padStart(digits, "0")}`
}

export function inputToMoney(raw: string, currency: string): Money {
  const digits = minorDigits(currency)
  const [whole = "", fraction = ""] = raw.split(".")
  if (!/^\d*$/.test(whole) || !/^\d*$/.test(fraction)) return money(0, currency)

  const minor =
    digits === 0 ? 0 : Number(fraction.padEnd(digits, "0").slice(0, digits))
  return money(Number(whole || "0") * 10 ** digits + minor, currency)
}
