export function groupAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3")
}

export function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}
