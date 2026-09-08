import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import type { StepUpChallenge } from "../types"

const TARGET_LABELS: Record<string, string> = {
  current: "Current email",
  new: "New email",
}

export type StepUpSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  challenge: StepUpChallenge | null
  codes: Record<string, string>
  codeLength: number
  hint: string
  busy: boolean
  onCode: (label: string, value: string) => void
  onSubmit: () => void
}

export function StepUpSheet({
  open,
  onOpenChange,
  challenge,
  codes,
  codeLength,
  hint,
  busy,
  onCode,
  onSubmit,
}: StepUpSheetProps) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Confirm it's you"
      hint={hint}
      className="px-6"
      footer={
        <Button
          size="lg"
          className="h-14 w-full text-base"
          disabled={!challenge || busy}
          onClick={onSubmit}
        >
          {busy ? <Spinner /> : "Verify"}
        </Button>
      }
    >
      {challenge ? (
        <div className="flex flex-col gap-5 py-2">
          {challenge.targets.map((target, index) => (
            <div key={target.label} className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                {TARGET_LABELS[target.label] ?? target.label} · {target.email}
              </p>
              {target.verified ? (
                <p className="text-sm font-bold text-emerald-500">Verified</p>
              ) : (
                <InputOTP
                  maxLength={codeLength}
                  value={codes[target.label] ?? ""}
                  onChange={(value) => onCode(target.label, value)}
                  autoFocus={index === 0}
                  disabled={busy}
                  inputMode="numeric"
                >
                  <InputOTPGroup className="w-full gap-2">
                    {Array.from({ length: codeLength }, (_, slot) => (
                      <InputOTPSlot
                        key={slot}
                        index={slot}
                        className="h-14 flex-1 rounded-2xl border-0 bg-input text-xl font-bold first:rounded-2xl last:rounded-2xl"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-8">
          <Spinner className="text-muted-foreground" />
        </div>
      )}
    </ActionSheet>
  )
}
