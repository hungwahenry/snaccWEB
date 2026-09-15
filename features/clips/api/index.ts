import { api } from "@/lib/api/client"
import type { ClipContentType } from "../utils/clips"

interface ClipUploadLink {
  id: string
  url: string
  method: "PUT"
  headers: Record<string, string>
  expires_at: string
}

const UPLOAD_FAILED = "Your clip could not be uploaded. Try again."

function putFile(
  link: ClipUploadLink,
  file: File,
  onProgress: (fraction: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open(link.method, link.url)
    Object.entries(link.headers).forEach(([name, value]) =>
      request.setRequestHeader(name, value)
    )
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total)
    }
    request.onload = () =>
      request.status >= 200 && request.status < 300
        ? resolve()
        : reject(new Error(UPLOAD_FAILED))
    request.onerror = () => reject(new Error(UPLOAD_FAILED))
    request.send(file)
  })
}

export async function uploadClip(
  file: File,
  contentType: ClipContentType,
  onProgress: (fraction: number) => void
): Promise<string> {
  const link = await api.post<ClipUploadLink>("/uploads/clips", {
    contentType,
    sizeBytes: file.size,
  })
  await putFile(link, file, onProgress)
  return link.id
}
