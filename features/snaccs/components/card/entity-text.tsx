import Link from "next/link"
import type { CSSProperties } from "react"
import type { SnaccEntity } from "../../types"
import { toRenderedSegments } from "../../utils/entities"

export function EntityText({
  body,
  entities,
  hrefFor,
  entityClassName,
  entityStyle,
  stripLinks,
  className,
}: {
  body: string
  entities: SnaccEntity[]
  hrefFor: (entity: SnaccEntity) => string
  entityClassName?: string
  entityStyle?: (entity: SnaccEntity) => CSSProperties | undefined
  stripLinks?: boolean
  className?: string
}) {
  return (
    <p className={className}>
      {toRenderedSegments(body, entities, stripLinks).map((segment, index) => {
        const { entity } = segment
        if (!entity) return segment.text
        return (
          <Link
            key={index}
            href={hrefFor(entity)}
            onClick={(event) => event.stopPropagation()}
            className={entityClassName}
            style={entityStyle?.(entity)}
          >
            {segment.text}
          </Link>
        )
      })}
    </p>
  )
}
