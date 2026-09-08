import { AtSignIcon, ChevronDownIcon, LandmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { BackHeader } from "@/features/navigation/components/back-header"
import { formatNaira } from "@/lib/format"
import type { PayFlow } from "../../hooks/pay/use-pay-flow"
import { BankPickerSheet } from "../shared/bank-picker-sheet"
import { ResolvedAccount } from "../shared/resolved-account"
import { PAY_TITLES } from "./pay-titles"

export function RecipientStep({ flow }: { flow: PayFlow }) {
  const QueryIcon = flow.bankMode ? LandmarkIcon : AtSignIcon

  return (
    <>
      <BackHeader
        title={`${PAY_TITLES[flow.mode]} ${flow.amountLabel}`}
        onBack={flow.backToAmount}
      />

      <div className="flex flex-col gap-4 px-6 py-6">
        <div className="relative">
          <QueryIcon className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={flow.query}
            onChange={(event) => flow.setQuery(event.target.value)}
            placeholder={
              flow.mode === "send"
                ? "@username or account number"
                : "@username on Snacc"
            }
            autoCapitalize="none"
            autoCorrect="off"
            autoFocus
            className="h-14 rounded-full pl-12 text-base md:text-base"
          />
        </div>

        {flow.bankMode ? (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => flow.setBankPickerOpen(true)}
              className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-left transition-opacity active:opacity-70"
            >
              <span className="flex-1 text-foreground">
                {flow.bank?.name ?? "Choose their bank"}
              </span>
              <ChevronDownIcon className="size-5 text-muted-foreground" />
            </button>
            <ResolvedAccount
              checking={flow.resolving}
              name={flow.accountName}
              bankName={flow.bank?.name}
              error={flow.resolveFailed}
            />
            {flow.fee > 0 ? (
              <p className="px-1 text-sm text-muted-foreground">
                Bank sends carry a {formatNaira(flow.fee)} fee.
              </p>
            ) : null}
          </div>
        ) : null}

        {flow.suggestions.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-border">
            {flow.suggestions.slice(0, 5).map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => flow.pickUser(user)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/60 active:opacity-70"
              >
                <UserAvatar
                  alt={user.display_name ?? "User"}
                  className="size-9"
                  avatarUrl={user.avatar_url}
                  name={user.username}
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-bold text-foreground">
                    {user.display_name ?? user.username}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    @{user.username}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : flow.searching ? (
          <div className="flex justify-center py-4">
            <Spinner className="text-muted-foreground" />
          </div>
        ) : flow.noMatches ? (
          <EmptyState compact title="No matches." className="py-4" />
        ) : null}

        {!flow.bankMode &&
        !flow.picked &&
        flow.recipients.length > 0 &&
        flow.query.length === 0 ? (
          <div className="flex flex-col gap-2">
            <Eyebrow>Recent</Eyebrow>
            {flow.recipients.slice(0, 6).map((recipient) => (
              <button
                key={recipient.id}
                type="button"
                onClick={() => flow.pickRecipient(recipient)}
                className="flex w-full items-center gap-3 py-2 text-left transition-opacity active:opacity-70"
              >
                {recipient.kind === "user" && recipient.user ? (
                  <>
                    <UserAvatar
                      alt={recipient.user.display_name ?? "User"}
                      className="size-9"
                      avatarUrl={recipient.user.avatar_url}
                      name={recipient.user.username}
                    />
                    <span className="font-bold text-foreground">
                      @{recipient.user.username}
                    </span>
                  </>
                ) : recipient.bank ? (
                  <>
                    <span className="flex size-9 items-center justify-center rounded-full bg-muted">
                      <LandmarkIcon className="size-4 text-foreground" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-bold text-foreground">
                        {recipient.bank.account_name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {recipient.bank.bank_name} ••
                        {recipient.bank.account_last4}
                      </span>
                    </span>
                  </>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}

        <Button
          size="lg"
          className="mt-2 h-14 text-base"
          disabled={!flow.recipientReady}
          onClick={flow.toReview}
        >
          Review
        </Button>
      </div>

      <BankPickerSheet
        open={flow.bankPickerOpen}
        onOpenChange={flow.setBankPickerOpen}
        banks={flow.banks}
        onSelect={flow.selectBank}
      />
    </>
  )
}
