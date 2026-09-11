"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { getRecipients, removeRecipient } from "../../api"
import { removeRecipientFromCache } from "../../cache"
import type { WalletRecipient } from "../../types"
import { walletKeys, walletMutationKeys } from "../../utils/keys"
import { forgetRecipientTitle } from "../../utils/recipients"

export function useRecipients(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: walletKeys.recipients(),
    queryFn: getRecipients,
    enabled: options.enabled,
  })
}

export function useForgetRecipient() {
  const remove = useMutation({
    mutationKey: walletMutationKeys.removeRecipient(),
    mutationFn: (recipient: WalletRecipient) => removeRecipient(recipient.id),
    onSuccess: (_result, recipient) => removeRecipientFromCache(recipient.id),
  })

  return (recipient: WalletRecipient) =>
    confirm({
      title: forgetRecipientTitle(recipient),
      message: "You can still send to them. They just stop showing up here.",
      actions: [
        {
          label: "Remove",
          destructive: true,
          onPress: () => remove.mutate(recipient),
        },
      ],
    })
}
