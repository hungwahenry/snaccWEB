import type { UseQueryResult } from "@tanstack/react-query"
import { Fact, Facts, Section } from "@/features/admin/shell/components/detail"
import { QueryView } from "@/features/admin/shell/components/query-view"
import type { PremiumStats } from "../types"
import { premiumFacts, type PremiumFact } from "../utils/premium"

function FactList({ facts }: { facts: PremiumFact[] }) {
  return (
    <Facts>
      {facts.map((fact) => (
        <Fact key={fact.label} label={fact.label} value={fact.value} />
      ))}
    </Facts>
  )
}

export function PremiumStatsPanel({
  query,
}: {
  query: UseQueryResult<PremiumStats>
}) {
  return (
    <Section title="Subscriptions">
      <QueryView query={query} what="subscription figures">
        {(stats) => {
          const facts = premiumFacts(stats)

          return (
            <div className="grid gap-3 lg:grid-cols-2">
              <FactList facts={facts.standing} />
              <FactList facts={facts.stores} />
            </div>
          )
        }}
      </QueryView>
    </Section>
  )
}
