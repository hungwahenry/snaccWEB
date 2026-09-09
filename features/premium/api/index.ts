import { api } from "@/lib/api/client"
import type { Premium, PremiumPlan, PremiumPurchase } from "../types"

export const getPremium = () => api.get<Premium>("/premium")

export const buyPremium = (
  plan: PremiumPlan,
  credential: { pin?: string; stepUpId?: string }
) => api.post<PremiumPurchase>("/premium/purchase", { plan, ...credential })
