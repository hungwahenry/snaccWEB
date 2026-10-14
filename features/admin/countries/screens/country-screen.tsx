"use client"

import { Badge } from "@/components/ui/badge"
import { BackLink } from "@/features/admin/shell/components/back-link"
import { DetailHeader } from "@/features/admin/shell/components/detail"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { COUNTRIES_PATH } from "@/features/admin/shell/routes"
import { plural } from "@/features/admin/shell/utils/format"
import { CampusTypesTable } from "../components/campus-types-table"
import { RegionsTable } from "../components/regions-table"
import { useCountryScreen } from "../hooks/use-country-screen"

export function CountryScreen({ code }: { code: string }) {
  const { country, places, actions } = useCountryScreen(code)

  return (
    <>
      <BackLink href={COUNTRIES_PATH} label="Back to countries" />
      <div className="flex flex-col gap-6">
        {country.data ? (
          <DetailHeader
            title={country.data.name}
            badges={
              country.data.open ? (
                <Badge variant="secondary">Open</Badge>
              ) : (
                <Badge variant="outline">Closed</Badge>
              )
            }
            meta={
              <>
                <span>{country.data.code}</span>
                <span>{country.data.currency}</span>
                <span>
                  {plural(country.data.campuses, "campus", "campuses")}
                </span>
                <span>From age {country.data.min_age}</span>
              </>
            }
          />
        ) : null}
        <QueryView query={places} what="this country's places">
          {(data) => (
            <div className="flex flex-col gap-6">
              <RegionsTable
                regions={data.regions}
                onAdd={actions.addRegion}
                onSave={actions.saveRegion}
                onRemove={actions.removeRegion}
              />
              <CampusTypesTable
                types={data.campus_types}
                onAdd={actions.addType}
                onSave={actions.saveType}
                onRemove={actions.removeType}
              />
            </div>
          )}
        </QueryView>
      </div>
    </>
  )
}
