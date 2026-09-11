import type { UseQueryResult } from "@tanstack/react-query"
import { Fact, Facts, Section } from "@/features/admin/shell/components/detail"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import type { OpsHealth } from "../types"
import { HEALTH_STATUS, healthFacts, type HealthFact } from "../utils/ops"

function FactList({ facts }: { facts: HealthFact[] }) {
  return (
    <Facts>
      {facts.map((fact) => (
        <Fact key={fact.label} label={fact.label} value={fact.value} />
      ))}
    </Facts>
  )
}

export function HealthPanel({ query }: { query: UseQueryResult<OpsHealth> }) {
  return (
    <Section
      title="System health"
      action={
        query.data ? (
          <StatusBadge status={HEALTH_STATUS[query.data.status]} />
        ) : null
      }
    >
      <QueryView query={query} what="system health">
        {(health) => {
          const facts = healthFacts(health)

          return (
            <div className="grid gap-3 lg:grid-cols-2">
              <FactList facts={facts.services} />
              <FactList facts={facts.process} />
            </div>
          )
        }}
      </QueryView>
    </Section>
  )
}
