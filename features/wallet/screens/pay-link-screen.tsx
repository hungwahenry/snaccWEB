"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { PayLinkPanel } from "../components/pay-link/pay-link-panel"
import { WALLET_PATH } from "../routes"
import { copyPayLink, payLinkFor, sharePayLink } from "../share"

export function PayLinkScreen() {
  const back = useBack(WALLET_PATH)
  const me = useMe()
  const username = me.data?.profile?.username

  return (
    <>
      <BackHeader title="Your pay link" onBack={back} />
      {username ? (
        <PayLinkPanel
          username={username}
          avatarUrl={me.data?.profile?.avatar_url ?? null}
          link={payLinkFor(username)}
          onCopy={() => void copyPayLink(username)}
          onShare={() => void sharePayLink(username)}
        />
      ) : null}
    </>
  )
}
