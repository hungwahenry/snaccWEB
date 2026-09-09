import { api } from "@/lib/api/client"
import type { EggCollection } from "../types"

export const getEggCollection = () => api.get<EggCollection>("/easter-eggs")
