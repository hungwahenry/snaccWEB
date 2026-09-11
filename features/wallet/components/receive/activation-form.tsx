import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { ActivationFormProps } from "../../hooks/receive/use-activation-form"
import { BankPickerSheet } from "../shared/bank-picker-sheet"
import { ResolvedAccount } from "../shared/resolved-account"

const INPUT = "h-14 rounded-full px-5 text-base md:text-base"

export function ActivationForm({
  failureReason,
  identityRequired,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  bvn,
  setBvn,
  accountNumber,
  setAccountNumber,
  bankName,
  openBankPicker,
  bankPicker,
  resolved,
  missing,
  submitting,
  submit,
}: ActivationFormProps & { failureReason: string | null }) {
  return (
    <>
      <form
        className="flex flex-col gap-4 px-6 py-6"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-foreground">
            Get your own account number
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            A real bank account in your name — anyone transfers to it, your
            wallet gets it.
            {identityRequired
              ? " We verify who you are with your BVN once, as the law asks."
              : ""}
          </p>
        </div>

        {failureReason ? (
          <p className="text-sm text-destructive">{failureReason}</p>
        ) : null}

        <Input
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="First name (as your bank knows you)"
          className={INPUT}
        />
        <Input
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Last name"
          className={INPUT}
        />
        <Input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone number"
          type="tel"
          inputMode="tel"
          className={INPUT}
        />

        {identityRequired ? (
          <>
            <Input
              value={bvn}
              onChange={(event) => setBvn(event.target.value)}
              placeholder="BVN"
              inputMode="numeric"
              className={INPUT}
            />
            <Input
              value={accountNumber}
              onChange={(event) => setAccountNumber(event.target.value)}
              placeholder="An account you already own"
              inputMode="numeric"
              className={INPUT}
            />
            <button
              type="button"
              onClick={openBankPicker}
              className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-left transition-opacity active:opacity-70"
            >
              <span className="flex-1 text-foreground">
                {bankName ?? "Its bank"}
              </span>
              <ChevronDownIcon className="size-5 text-muted-foreground" />
            </button>
            <ResolvedAccount {...resolved} bankName={bankName} />
          </>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="h-14 text-base"
          disabled={missing !== null || submitting}
        >
          {submitting ? <Spinner /> : "Open my account number"}
        </Button>
        {missing ? (
          <p className="text-center text-sm text-muted-foreground">
            Still needs your {missing}.
          </p>
        ) : null}
      </form>

      <BankPickerSheet {...bankPicker} />
    </>
  )
}
