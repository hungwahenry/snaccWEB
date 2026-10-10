import { EntityText } from "@/features/snaccs/components/card/entity-text"
import type { Moment } from "../types"
import { sharesSnacc } from "../utils/shared"

const CAPTION_LIFT = 24

export function MomentWords({
  moment,
  bottomClearance,
}: {
  moment: Pick<Moment, "body" | "entities" | "image" | "snacc" | "snacc_gone">
  bottomClearance: number
}) {
  const { body } = moment
  if (!body) return null

  if (moment.image || sharesSnacc(moment)) {
    return (
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/45 px-5 pt-4"
        style={{
          paddingBottom: `calc(max(env(safe-area-inset-bottom), ${bottomClearance}px) + ${CAPTION_LIFT}px)`,
        }}
      >
        <EntityText
          body={body}
          entities={moment.entities}
          className="text-base leading-6 font-medium whitespace-pre-wrap text-white"
          entityClassName="font-extrabold"
        />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8">
      <EntityText
        body={body}
        entities={moment.entities}
        className="text-center text-3xl leading-10 font-extrabold break-words whitespace-pre-wrap text-white"
        entityClassName="underline"
      />
    </div>
  )
}
