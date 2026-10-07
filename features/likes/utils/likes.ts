export interface Likeable {
  liked: boolean
  likes_count: number
}

export function withLike<T extends Likeable>(item: T, liked: boolean): T {
  if (item.liked === liked) return item

  return {
    ...item,
    liked,
    likes_count: Math.max(0, item.likes_count + (liked ? 1 : -1)),
  }
}
