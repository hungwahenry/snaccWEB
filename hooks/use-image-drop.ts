"use client"

import { useEffect, useState, type ClipboardEvent, type DragEvent } from "react"
import { imageFilesIn } from "@/lib/media"

const carriesFiles = (event: DragEvent) =>
  event.dataTransfer.types.includes("Files")

export function useFileDropGuard(): void {
  useEffect(() => {
    const keepPage = (event: globalThis.DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) event.preventDefault()
    }
    window.addEventListener("dragover", keepPage)
    window.addEventListener("drop", keepPage)

    return () => {
      window.removeEventListener("dragover", keepPage)
      window.removeEventListener("drop", keepPage)
    }
  }, [])
}

export function useImageDrop(onFiles: ((files: File[]) => void) | undefined) {
  const [over, setOver] = useState(false)

  if (!onFiles) return { over: false, handlers: {} }

  return {
    over,
    handlers: {
      onPaste(event: ClipboardEvent) {
        const files = imageFilesIn(event.clipboardData)
        if (files.length === 0) return
        event.preventDefault()
        onFiles(files)
      },
      onDragOver(event: DragEvent) {
        if (!carriesFiles(event)) return
        event.preventDefault()
        setOver(true)
      },
      onDragLeave(event: DragEvent) {
        const next = event.relatedTarget
        if (next instanceof Node && event.currentTarget.contains(next)) return
        setOver(false)
      },
      onDrop(event: DragEvent) {
        if (!carriesFiles(event)) return
        event.preventDefault()
        setOver(false)
        const files = imageFilesIn(event.dataTransfer)
        if (files.length > 0) onFiles(files)
      },
    },
  }
}
