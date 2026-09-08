"use client"

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { getErrorMessage } from "@/lib/api/errors"
import type { Paginated } from "@/lib/api/types"
import { followUser, unfollowUser } from "../api"
import type { FollowUser } from "../types"

type Pages = InfiniteData<Paginated<FollowUser>>

export function useFollowableList(
  key: QueryKey,
  fetchPage: (page: number) => Promise<Paginated<FollowUser>>,
  options?: { enabled?: boolean }
) {
  const queryClient = useQueryClient()
  const { items, ...list } = useInfiniteList<FollowUser>(
    key,
    fetchPage,
    options
  )

  function patch(id: string, isFollowing: boolean) {
    queryClient.setQueryData<Pages>(key, (data) =>
      data
        ? {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.map((user) =>
                user.id === id ? { ...user, is_following: isFollowing } : user
              ),
            })),
          }
        : data
    )
  }

  const toggle = useMutation({
    mutationFn: (user: FollowUser) =>
      user.is_following ? unfollowUser(user.id) : followUser(user.id),
    onMutate: (user) => patch(user.id, !user.is_following),
    onError: (error, user) => {
      patch(user.id, user.is_following)
      toast.error(getErrorMessage(error))
    },
  })

  return { users: items, onToggleFollow: toggle.mutate, ...list }
}
