import { Upload } from "tus-js-client"
import { api } from "@/lib/api/client"
import type { ClipUpload } from "../types"

interface ClipUploadLink {
  id: string
  url: string
  expires_at: string
}

const CHUNK_BYTES = 5 * 1024 * 1024
const RETRY_DELAYS_MS = [0, 1_000, 3_000, 5_000, 10_000, 20_000]
const UPLOAD_FAILED = "Your clip could not be uploaded. Try again."

export function discardClipUpload(id: string): Promise<void> {
  return api.del(`/uploads/clips/${id}`)
}

export function startClipUpload(file: File): ClipUpload {
  const listeners = new Set<(fraction: number) => void>()
  let fraction = 0
  let link: Promise<ClipUploadLink> | null = null
  let sending: Promise<string> | null = null
  let transfer: Upload | null = null
  let cancelled = false

  const report = (next: number) => {
    fraction = next
    listeners.forEach((listener) => listener(next))
  }

  const requestLink = () => {
    link ??= api
      .post<ClipUploadLink>("/uploads/clips", { sizeBytes: file.size })
      .catch((error: unknown) => {
        link = null
        throw error
      })
    return link
  }

  const send = async (): Promise<string> => {
    const { id, url } = await requestLink()

    await new Promise<void>((resolve, reject) => {
      if (cancelled) {
        reject(new Error(UPLOAD_FAILED))
        return
      }
      transfer = new Upload(file, {
        uploadUrl: url,
        chunkSize: CHUNK_BYTES,
        retryDelays: RETRY_DELAYS_MS,
        storeFingerprintForResuming: false,
        onProgress: (sent, total) => report(total > 0 ? sent / total : 0),
        onSuccess: () => resolve(),
        onError: () => reject(new Error(UPLOAD_FAILED)),
      })
      transfer.start()
    })

    report(1)
    return id
  }

  const done = () => {
    sending ??= send().catch((error: unknown) => {
      sending = null
      throw error
    })
    return sending
  }

  void done().catch(() => undefined)

  return {
    done,
    watch: (listener) => {
      listeners.add(listener)
      listener(fraction)
      return () => {
        listeners.delete(listener)
      }
    },
    cancel: () => {
      cancelled = true
      void transfer?.abort()
      void link?.then(({ id }) => discardClipUpload(id)).catch(() => undefined)
    },
  }
}
