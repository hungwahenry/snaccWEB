export const adminOpsKeys = {
  all: () => ["admin", "ops"] as const,
  health: () => ["admin", "ops", "health"] as const,
  queues: () => ["admin", "ops", "queues"] as const,
  drift: () => ["admin", "ops", "drift"] as const,
}
