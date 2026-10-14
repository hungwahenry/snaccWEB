"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { CURRENCIES_PATH } from "@/features/admin/shell/routes"
import { CurrencySettingsTable } from "../components/currency-settings-table"
import { EarnAmountsTable } from "../components/earn-amounts-table"
import { useCurrencyScreen } from "../hooks/use-currency-screen"

export function CurrencyScreen({ code }: { code: string }) {
  const { currency, settings, settingActions, earnings, earningActions } =
    useCurrencyScreen(code)

  return (
    <>
      <BackLink href={CURRENCIES_PATH} label="Back to currencies" />
      <PageHeader
        title={currency ? `${currency.name} (${code})` : code}
        description="What money costs and how far it goes in this currency. A change reaches the apps within about 30 seconds."
      />
      <div className="flex flex-col gap-6">
        <CurrencySettingsTable
          code={code}
          query={settings}
          onSave={settingActions.save}
        />
        <EarnAmountsTable
          code={code}
          query={earnings}
          onSave={earningActions.save}
        />
      </div>
    </>
  )
}
