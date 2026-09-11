"use client"

import { useQuery } from "@tanstack/react-query"
import { listAdmins } from "../api"
import { adminAdminKeys } from "../utils/keys"

export function useAdmins() {
  return useQuery({ queryKey: adminAdminKeys.list(), queryFn: listAdmins })
}
