import type { PayMode } from "../../routes"

export const PAY_TITLES: Record<PayMode, string> = {
  send: "Send",
  request: "Request",
  topup: "Add money",
}
