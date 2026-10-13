import "server-only"
import { headers } from "next/headers"

const COUNTRY = /^[A-Za-z]{2}$/

export async function readerCountry(
  asked: string | undefined
): Promise<string | null> {
  if (asked && COUNTRY.test(asked)) return asked.toUpperCase()

  const detected = (await headers()).get("x-vercel-ip-country")
  return detected && COUNTRY.test(detected) ? detected.toUpperCase() : null
}
