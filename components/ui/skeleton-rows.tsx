import type { ComponentType } from "react"

export function SkeletonRows({
  count,
  item: Item,
}: {
  count: number
  item: ComponentType
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Item key={i} />
      ))}
    </>
  )
}
