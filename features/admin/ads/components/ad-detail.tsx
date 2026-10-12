"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  DetailHeader,
  EmptyNote,
  Fact,
  Facts,
  Section,
} from "@/features/admin/shell/components/detail"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { snaccPath } from "@/features/admin/shell/routes"
import { formatDate } from "@/lib/format"
import type { AdFact, AdminAd, AdReason, AdReviewActions } from "../types"
import { moneyFacts, reviewFacts } from "../utils/ads"
import { audienceFacts, placementsLine } from "../utils/audience"
import { adActions, adStatus } from "../utils/status"
import { AdSnacc } from "./ad-snacc"
import { PersonCell } from "./person-cell"
import { RejectDialog } from "./reject-dialog"

function FactList({ facts }: { facts: AdFact[] }) {
  return (
    <Facts>
      {facts.map((fact) => (
        <Fact key={fact.label} label={fact.label} value={fact.value} />
      ))}
    </Facts>
  )
}

function ReviewActions({
  ad,
  reasons,
  actions,
}: {
  ad: AdminAd
  reasons: AdReason[]
  actions: AdReviewActions
}) {
  const allowed = adActions(ad.status)

  return (
    <>
      {allowed.includes("approve") ? (
        <CanAct permission="ads.review">
          <ConfirmAction
            trigger={<Button size="sm">Approve</Button>}
            tone="default"
            title="Approve this promotion?"
            description="It starts showing to the audience below from its start date, and the advertiser is told it was approved."
            confirmLabel="Approve"
            onConfirm={() => actions.approve()}
          />
        </CanAct>
      ) : null}
      {allowed.includes("reject") ? (
        <CanAct permission="ads.review">
          <RejectDialog
            reasons={reasons}
            trigger={
              <Button variant="destructive" size="sm">
                Reject
              </Button>
            }
            onSubmit={actions.reject}
          />
        </CanAct>
      ) : null}
      {allowed.includes("pause") ? (
        <CanAct permission="ads.review">
          <ConfirmAction
            trigger={
              <Button variant="outline" size="sm">
                Pause
              </Button>
            }
            tone="default"
            title="Pause this promotion?"
            description="It stops showing until someone resumes it. Its budget stays held, and if its end date passes while paused it ends and settles."
            confirmLabel="Pause"
            onConfirm={() => actions.pause()}
          />
        </CanAct>
      ) : null}
      {allowed.includes("resume") ? (
        <CanAct permission="ads.review">
          <ConfirmAction
            trigger={
              <Button variant="outline" size="sm">
                Resume
              </Button>
            }
            tone="default"
            title="Resume this promotion?"
            description="It starts showing to its audience again."
            confirmLabel="Resume"
            onConfirm={() => actions.resume()}
          />
        </CanAct>
      ) : null}
      {allowed.includes("end") ? (
        <CanAct permission="ads.review">
          <ConfirmAction
            trigger={
              <Button variant="destructive" size="sm">
                End
              </Button>
            }
            title="End this promotion now?"
            description="It stops showing for good. What it has spent is kept as revenue and the rest goes back to the advertiser's wallet."
            confirmLabel="End and settle"
            onConfirm={() => actions.end()}
          />
        </CanAct>
      ) : null}
    </>
  )
}

export function AdDetail({
  ad,
  reasons,
  actions,
}: {
  ad: AdminAd
  reasons: AdReason[]
  actions: AdReviewActions
}) {
  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title="Promotion"
        badges={
          <>
            <StatusBadge status={adStatus(ad)} />
            {ad.snacc.deleted ? (
              <Badge variant="destructive">Snacc removed</Badge>
            ) : null}
          </>
        }
        meta={<span>Sent {formatDate(ad.created_at)}</span>}
        actions={<ReviewActions ad={ad} reasons={reasons} actions={actions} />}
      />

      <div className="flex flex-col gap-1 rounded-lg border px-4 py-3">
        <p className="text-xs text-muted-foreground">Paid for by</p>
        <PersonCell person={ad.advertiser} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <Section
            title="Snacc"
            action={
              <Link
                href={snaccPath(ad.snacc.id)}
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Open in Snaccs
              </Link>
            }
          >
            <AdSnacc snacc={ad.snacc} />
          </Section>

          <Section
            title="Button"
            description="Where a tap on the promotion's button goes."
          >
            {ad.button ? (
              <Facts>
                <Fact label="Says" value={ad.button.label} />
                <Fact
                  label="Opens"
                  value={
                    <a
                      href={ad.button.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs break-all underline underline-offset-4"
                    >
                      {ad.button.url}
                    </a>
                  }
                />
              </Facts>
            ) : (
              <EmptyNote>
                No button. It shows as a plain promoted snacc.
              </EmptyNote>
            )}
          </Section>

          <Section title="Where and when">
            <Facts>
              <Fact label="Shown in" value={placementsLine(ad.placements)} />
              <Fact label="Starts" value={formatDate(ad.starts_at)} />
              <Fact label="Ends" value={formatDate(ad.ends_at)} />
            </Facts>
          </Section>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <Section title="Money and results">
            <FactList facts={moneyFacts(ad)} />
          </Section>

          <Section
            title="Audience"
            description="Who it is shown to. Anything left open reaches everyone."
          >
            <FactList facts={audienceFacts(ad.audience)} />
          </Section>

          <Section title="Review">
            <FactList facts={reviewFacts(ad)} />
          </Section>
        </div>
      </div>
    </div>
  )
}
