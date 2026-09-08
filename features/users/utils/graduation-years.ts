const THIS_YEAR = new Date().getFullYear()
const SPAN = 60

export const GRADUATION_YEARS: number[] = Array.from(
  { length: SPAN },
  (_, i) => THIS_YEAR - i
)
