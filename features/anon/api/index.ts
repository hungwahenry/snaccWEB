import type { AnonThread } from "./public"

export class AnonError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string | null
  ) {
    super(message)
  }
}

async function parse(res: Response): Promise<AnonThread> {
  const json = await res.json().catch(() => null)
  if (!res.ok) {
    throw new AnonError(
      res.status,
      json?.message ?? "Something went wrong.",
      json?.code ?? null
    )
  }
  return json.data as AnonThread
}

function post(path: string, body: string): Promise<AnonThread> {
  return fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  }).then(parse)
}

export function sendAnon(username: string, body: string): Promise<AnonThread> {
  return post(`/api/anon/${encodeURIComponent(username)}`, body)
}

export function replyAnon(
  conversationId: string,
  body: string
): Promise<AnonThread> {
  return post(`/api/anon/thread/${encodeURIComponent(conversationId)}`, body)
}

export async function readAnonThread(
  conversationId: string
): Promise<AnonThread | null> {
  const res = await fetch(
    `/api/anon/thread/${encodeURIComponent(conversationId)}`
  )
  if (!res.ok) return null
  return ((await res.json()) as { data: AnonThread }).data
}
