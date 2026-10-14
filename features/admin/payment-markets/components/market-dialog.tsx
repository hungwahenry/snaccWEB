"use client"

import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import {
  CheckboxField,
  SearchSelectField,
  SelectField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { MarketChoices } from "../hooks/use-payment-markets-screen"
import type { AdminPaymentMarket, UpsertMarketInput } from "../types"
import {
  DEPOSIT_METHODS,
  draftFrom,
  neededSettings,
  parseDraft,
  PAYOUT_METHODS,
  settingsHint,
  toggled,
} from "../utils/markets"

function MarketForm({
  market,
  choices,
  onSubmit,
}: {
  market?: AdminPaymentMarket
  choices: MarketChoices
  onSubmit: (country: string, input: UpsertMarketInput) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => draftFrom(market))
  const parsed = parseDraft(draft)
  const provider = choices.providerList.find(
    (each) => each.key === draft.provider
  )

  return (
    <DialogForm
      submitLabel={market ? "Save" : "Add market"}
      canSubmit={parsed.ok}
      onSubmit={() =>
        parsed.ok ? onSubmit(parsed.country, parsed.input) : undefined
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {market ? null : (
          <SearchSelectField
            label="Country"
            value={draft.country}
            onChange={(country) => set("country", country)}
            options={choices.countries}
            placeholder="Pick a country"
            empty="No country by that name."
          />
        )}
        <SelectField
          label="Provider"
          value={draft.provider}
          onChange={(provider) => set("provider", provider)}
          options={choices.providers}
          placeholder="Pick a provider"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        {DEPOSIT_METHODS.map((method) => (
          <CheckboxField
            key={method.value}
            label={method.label}
            checked={draft.deposits.includes(method.value)}
            onChange={(on) =>
              set("deposits", toggled(draft.deposits, method.value, on))
            }
          />
        ))}
        {PAYOUT_METHODS.map((method) => (
          <CheckboxField
            key={method.value}
            label={method.label}
            checked={draft.payouts.includes(method.value)}
            onChange={(on) =>
              set("payouts", toggled(draft.payouts, method.value, on))
            }
          />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Account number digits"
          inputMode="numeric"
          {...text("accountNumberLength")}
        />
        <TextField
          label="ID people give"
          optional
          placeholder="None"
          {...text("idName")}
        />
        <TextField
          label="ID digits"
          optional
          inputMode="numeric"
          {...text("idLength")}
        />
      </div>
      <FormNote>
        An ID is asked before a personal account number is opened, together with
        a bank account the person already owns. Leave it empty where the
        provider asks for none.
      </FormNote>
      <TextField
        label="Provider settings (JSON)"
        multiline
        rows={6}
        mono
        hint={
          parsed.ok || parsed.message === null ? (
            settingsHint(provider, neededSettings(provider, draft))
          ) : (
            <span className="text-destructive">{parsed.message}</span>
          )
        }
        {...text("settings")}
      />
    </DialogForm>
  )
}

export function MarketDialog({
  market,
  choices,
  trigger,
  disabled,
  onSubmit,
}: {
  market?: AdminPaymentMarket
  choices: MarketChoices
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (country: string, input: UpsertMarketInput) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={market ? `${market.country} market` : "New payment market"}
      description="How money reaches a bank in one country, through one provider, in that country's currency."
      wide
    >
      <MarketForm market={market} choices={choices} onSubmit={onSubmit} />
    </FormDialog>
  )
}
