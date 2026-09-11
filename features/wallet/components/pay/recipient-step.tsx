import { AtSignIcon, ChevronDownIcon, LandmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { BackHeader } from "@/features/navigation/components/back-header"
import { handleOf, nameOf } from "@/features/users/utils/names"
import type { PayFlow } from "../../hooks/pay/use-pay-flow"
import type { WalletRecipient } from "../../types"
import { recipientLabel } from "../../utils/recipients"
import { BankPickerSheet } from "../shared/bank-picker-sheet"
import { PartyAvatar } from "../shared/party-avatar"
import { ResolvedAccount } from "../shared/resolved-account"

export function RecipientStep({
  title,
  onBack,
  query,
  setQuery,
  placeholder,
  bankMode,
  bankName,
  openBankPicker,
  bankPicker,
  resolved,
  feeNote,
  suggestions,
  searching,
  noMatches,
  onPickUser,
  recents,
  onPickRecent,
  ready,
  onNext,
}: PayFlow["recipient"]) {
  const QueryIcon = bankMode ? LandmarkIcon : AtSignIcon

  return (
    <>
      <BackHeader title={title} onBack={onBack} />

      <div className="flex flex-col gap-4 px-6 py-6">
        <div className="relative">
          <QueryIcon className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            autoCapitalize="none"
            autoCorrect="off"
            autoFocus
            className="h-14 rounded-full pl-12 text-base md:text-base"
          />
        </div>

        {bankMode ? (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={openBankPicker}
              className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-left transition-opacity active:opacity-70"
            >
              <span className="flex-1 text-foreground">
                {bankName ?? "Choose their bank"}
              </span>
              <ChevronDownIcon className="size-5 text-muted-foreground" />
            </button>
            <ResolvedAccount {...resolved} bankName={bankName} />
            {feeNote ? (
              <p className="px-1 text-sm text-muted-foreground">{feeNote}</p>
            ) : null}
          </div>
        ) : null}

        {suggestions.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-border">
            {suggestions.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => onPickUser(user)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/60 active:opacity-70"
              >
                <UserAvatar
                  alt={nameOf(user)}
                  className="size-9"
                  avatarUrl={user.avatar_url}
                  name={user.username}
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-bold text-foreground">
                    {nameOf(user)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {handleOf(user)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : searching ? (
          <div className="flex justify-center py-4">
            <Spinner className="text-muted-foreground" />
          </div>
        ) : noMatches ? (
          <EmptyState compact title="No matches." className="py-4" />
        ) : null}

        {recents.length > 0 ? (
          <div className="flex flex-col gap-2">
            <Eyebrow>Recent</Eyebrow>
            {recents.map((recipient) => (
              <RecentRow
                key={recipient.id}
                recipient={recipient}
                onPress={onPickRecent}
              />
            ))}
          </div>
        ) : null}

        <Button
          size="lg"
          className="mt-2 h-14 text-base"
          disabled={!ready}
          onClick={onNext}
        >
          Review
        </Button>
      </div>

      <BankPickerSheet {...bankPicker} />
    </>
  )
}

function RecentRow({
  recipient,
  onPress,
}: {
  recipient: WalletRecipient
  onPress: (recipient: WalletRecipient) => void
}) {
  const label = recipientLabel(recipient)

  return (
    <button
      type="button"
      onClick={() => onPress(recipient)}
      className="flex w-full items-center gap-3 py-2 text-left transition-opacity active:opacity-70"
    >
      <PartyAvatar
        person={recipient.user}
        className="size-9"
        iconClassName="size-4"
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-bold text-foreground">
          {label.title}
        </span>
        {label.subtitle ? (
          <span className="truncate text-sm text-muted-foreground">
            {label.subtitle}
          </span>
        ) : null}
      </span>
    </button>
  )
}
