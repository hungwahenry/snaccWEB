import type { UseQueryResult } from "@tanstack/react-query"
import { Fact, Facts, Section } from "@/features/admin/shell/components/detail"
import { QueryView } from "@/features/admin/shell/components/query-view"
import type { WebhookStats } from "../types"
import { deliveryFacts } from "../utils/webhooks"

export function DeliveriesPanel({
  query,
}: {
  query: UseQueryResult<WebhookStats>
}) {
  return (
    <Section title="Deliveries">
      <QueryView query={query} what="delivery figures">
        {(stats) => (
          <Facts>
            {deliveryFacts(stats).map((fact) => (
              <Fact key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </Facts>
        )}
      </QueryView>
    </Section>
  )
}
