import Link from "next/link"
import type { CSSProperties } from "react"
import type { SnaccEntity } from "../../types"
import { toRenderedSegments } from "../../utils/entities"

export function EntityText<E extends SnaccEntity>({
  body,
  entities,
  hrefFor,
  entityClassName,
  entityStyle,
  stripLinks,
  className,
}: {
  body: string
  entities: E[]
  hrefFor?: (entity: E) => string
  entityClassName?: string
  entityStyle?: (entity: E) => CSSProperties | undefined
  stripLinks?: boolean
  className?: string
}) {
  return (
    <p className={className}>
      {toRenderedSegments(body, entities, stripLinks).map((segment, index) => {
        const { entity } = segment
        if (!entity) return segment.text
        if (!hrefFor) {
          return (
            <span
              key={index}
              className={entityClassName}
              style={entityStyle?.(entity)}
            >
              {segment.text}
            </span>
          )
        }
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
