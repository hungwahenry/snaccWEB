import { api } from "@/lib/api/client"
import type {
  OpsDrift,
  OpsHealth,
  OpsQueue,
  OpsReconcile,
  OpsRepairResult,
  OpsTask,
} from "../types"

export function getHealth() {
  return api.get<OpsHealth>("/admin/ops/health")
}

export function getQueues() {
  return api.get<OpsQueue[]>("/admin/ops/queues")
}

export function getDrift() {
  return api.get<OpsDrift>("/admin/ops/drift")
}

export function runTask(task: OpsTask) {
  return api.post<OpsRepairResult>(`/admin/ops/run/${task}`)
}

export function reconcilePaystack() {
  return api.post<OpsReconcile>("/admin/ops/reconcile")
}

export function retryQueue(name: string) {
  return api.post<{ retried: number }>(`/admin/ops/queues/${name}/retry`)
}
