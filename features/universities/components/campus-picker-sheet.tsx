"use client"

import { ArrowLeftIcon, SearchIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type {
  CampusAdding,
  CampusDraft,
  CampusSheetState,
} from "../hooks/use-campus-sheet"
import { CampusResults } from "./campus-results"

type CampusPickerSheetProps = CampusSheetState & { title: string }

const ADD_FORM_ID = "add-campus-form"

export function CampusPickerSheet(props: CampusPickerSheetProps) {
  const { adding } = props

  return adding?.draft ? (
    <ActionSheet
      open={props.open}
      onOpenChange={props.onOpenChange}
      title="Add your campus"
      tall
      footer={
        <Button
          type="submit"
          form={ADD_FORM_ID}
          size="lg"
          className="h-12 w-full"
          disabled={!adding.ready || adding.submitting}
        >
          {adding.submitting ? <Spinner /> : "Add campus"}
        </Button>
      }
    >
      <CampusAddForm adding={adding} draft={adding.draft} />
    </ActionSheet>
  ) : (
    <ActionSheet
      open={props.open}
      onOpenChange={props.onOpenChange}
      title={props.title}
      tall
    >
      <div className="sticky top-0 z-10 bg-popover px-4 pb-3 sm:px-5">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={props.search}
            onChange={(event) => props.onSearch(event.target.value)}
            placeholder="Search your university"
            autoCorrect="off"
            autoFocus
            className="h-14 rounded-full pr-11 pl-11 text-base md:text-base"
          />
          {props.searching ? (
            <Spinner className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground" />
          ) : null}
        </div>
      </div>
      <div className="px-2 sm:px-3">
        <CampusResults
          search={props.search}
          searching={props.searching}
          results={props.results}
          onSelect={props.onSelect}
          onAdd={adding?.start ?? null}
        />
      </div>
    </ActionSheet>
  )
}

function CampusAddForm({
  adding,
  draft,
}: {
  adding: CampusAdding
  draft: CampusDraft
}) {
  return (
    <form
      id={ADD_FORM_ID}
      className="flex flex-col gap-3 px-4 pb-4 sm:px-5"
      onSubmit={(event) => {
        event.preventDefault()
        adding.submit()
      }}
    >
      <button
        type="button"
        onClick={adding.back}
        className="flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to search
      </button>
      <Input
        value={draft.name}
        onChange={(event) => adding.change({ name: event.target.value })}
        placeholder="Full name, as your campus writes it"
        aria-label="Full name"
        autoFocus
        maxLength={200}
        className="h-12 text-base md:text-base"
      />
      <Input
        value={draft.acronym}
        onChange={(event) => adding.change({ acronym: event.target.value })}
        placeholder="Short name, like UCC (optional)"
        aria-label="Short name"
        autoCorrect="off"
        maxLength={20}
        className="h-12 text-base md:text-base"
      />
      {adding.error ? (
        <p role="alert" className="px-1 text-sm text-destructive">
          {adding.error}
        </p>
      ) : null}
      <p className="px-1 text-sm leading-5 text-muted-foreground">
        We check every campus that&apos;s added. Until yours is ready
        you&apos;ll wait on Snacc, and we&apos;ll email you when you&apos;re in.
      </p>
    </form>
  )
}
