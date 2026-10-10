import type { Moment } from "../types"

export function sharesSnacc(
  moment: Pick<Moment, "snacc" | "snacc_gone">
): boolean {
  return moment.snacc !== null || moment.snacc_gone !== null
}
