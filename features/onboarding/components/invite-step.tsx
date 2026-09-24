import { CopyIcon, ShareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import { InviteCodeField } from "@/features/referrals/components/invite-code-field"
import type { OnboardingInvite } from "../hooks/use-onboarding-form"

export function InviteStep({ form }: { form: OnboardingInvite }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Got an invite code?
          </h1>
          <p className="text-base leading-6 text-muted-foreground">
            If a friend sent you one, put it in. You both get paid once
            you&rsquo;ve really used Snacc.
          </p>
        </div>

        <InviteCodeField field={form.field} />
      </div>

      <div className="flex flex-col gap-5 rounded-3xl bg-card p-6 ring-1 ring-border">
        <div className="flex flex-col gap-2">
          <Eyebrow>Your own code</Eyebrow>
          {form.own ? (
            <p className="text-3xl font-extrabold tracking-widest text-foreground tabular-nums select-all">
              {form.own.code}
            </p>
          ) : (
            <Skeleton className="h-9 w-44 rounded-xl" />
          )}
          <p className="text-sm leading-5 text-muted-foreground">
            {form.own?.blurb ?? "Bring your friends and you both get paid."}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            size="lg"
            className="h-12 flex-1"
            disabled={!form.own}
            onClick={form.own?.onShare}
          >
            <ShareIcon /> Share
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="h-12 flex-1"
            disabled={!form.own}
            onClick={form.own?.onCopy}
          >
            <CopyIcon /> Copy link
          </Button>
        </div>
      </div>
    </div>
  )
}
