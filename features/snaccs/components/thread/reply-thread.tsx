import type { SnaccWithParent } from "../../types"
import { SnaccCard, type SnaccCardProps } from "../card/snacc-card"
import { ReplyContext } from "./reply-context"

type ReplyThreadProps = Omit<SnaccCardProps, "snacc" | "flushTop"> & {
  snacc: SnaccWithParent
  onOpenParent: (id: string) => void
}

export function ReplyThread({
  snacc,
  onOpenParent,
  ...cardProps
}: ReplyThreadProps) {
  const parent = snacc.parent

  return (
    <div>
      {parent ? (
        <ReplyContext snacc={parent} onPress={() => onOpenParent(parent.id)} />
      ) : null}
      <SnaccCard snacc={snacc} flushTop={parent !== null} {...cardProps} />
    </div>
  )
}
