import type { SnaccWithParent } from "../../types"
import { asSnacc } from "../../utils/resnaccs"
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
        <ReplyContext
          snacc={parent}
          onPress={() => onOpenParent(parent.id)}
          onPressImage={(index) =>
            cardProps.onOpenImages(asSnacc(parent), index)
          }
          poll={{
            voting: cardProps.votingPollFor === parent.id,
            onVote: (optionId) => cardProps.onVote(asSnacc(parent), optionId),
            onOpenImage: (option) =>
              cardProps.onOpenPollImage(asSnacc(parent), option),
          }}
        />
      ) : null}
      <SnaccCard snacc={snacc} flushTop={parent !== null} {...cardProps} />
    </div>
  )
}
