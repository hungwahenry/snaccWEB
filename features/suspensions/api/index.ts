import { api } from "@/lib/api/client"
import type { Suspension } from "../types"

export const getSuspension = () => api.get<Suspension | null>("/me/suspension")
