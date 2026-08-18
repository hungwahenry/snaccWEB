export function can(permissions: string[] | undefined, key: string): boolean {
  return !!permissions && (permissions.includes("*") || permissions.includes(key))
}
