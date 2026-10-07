import {
  Section,
  Stat,
  StatGrid,
} from "@/features/admin/shell/components/detail"
import type { ResultStat } from "../types"

export function AnnouncementResults({ stats }: { stats: ResultStat[] }) {
  return (
    <Section title="How it landed">
      <StatGrid columns={4}>
        {stats.map((stat) => (
          <Stat
            key={stat.key}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
          />
        ))}
      </StatGrid>
    </Section>
  )
}
