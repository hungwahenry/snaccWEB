"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { LEDGER_PATH } from "@/features/admin/shell/routes"
import { PostingDetail } from "../components/posting-detail"
import { useWalletTransaction } from "../hooks/use-wallet"

export function PostingScreen({ id }: { id: string }) {
  const query = useWalletTransaction(id)

  return (
    <>
      <BackLink href={LEDGER_PATH} label="Back to the ledger" />
      <QueryView query={query} what="this posting">
        {(posting) => <PostingDetail posting={posting} />}
      </QueryView>
    </>
  )
}
