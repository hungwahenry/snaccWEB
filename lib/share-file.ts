/** Saves a file through a temporary link, the way a browser download starts. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const href = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = href
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(href)
}

export function isShareCancel(error: unknown): boolean {
  return (error as { name?: string } | null)?.name === "AbortError"
}

/**
 * Hands a file to the system share sheet where the browser has one, and downloads it otherwise.
 * Resolves quietly when the person closes the share sheet.
 */
export async function shareOrDownload(file: File): Promise<void> {
  if (
    typeof navigator.share === "function" &&
    navigator.canShare?.({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file] })
      return
    } catch (error) {
      if (isShareCancel(error)) return
      throw error
    }
  }

  downloadBlob(file, file.name)
}
