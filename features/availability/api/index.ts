import { api } from "@/lib/api/client"
import type { Availability } from "../types"

export const getAvailability = () => api.get<Availability>("/me/availability")
