"use client"

import { Undo2Icon } from "lucide-react"
import { useCallback } from "react"
import { Spinner } from "@/components/ui/spinner"
import type { PickedImage } from "@/lib/media"
import { cn } from "@/lib/utils"
import { useEditor } from "../hooks/use-editor"
import { CropStage } from "./crop-stage"
import { EditorCanvas } from "./editor-canvas"
import { TextDraft } from "./text-draft"
import { ToolRail } from "./tool-rail"

type ImageEditorSheetProps = {
  image: PickedImage | null
  onCancel: () => void
  onFinish: (edited: PickedImage | null) => void
  onFail: (error: unknown) => void
}

export function ImageEditorSheet(props: ImageEditorSheetProps) {
  if (!props.image) return null
  return <EditorBody {...props} />
}

function EditorBody({
  image,
  onCancel,
  onFinish,
  onFail,
}: ImageEditorSheetProps) {
  const editor = useEditor(image, onFail)
  const { layers, working, size } = editor

  const measureStage = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return
      const observer = new ResizeObserver(([entry]) =>
        editor.setStage({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      )
      observer.observe(node)
      return () => observer.disconnect()
    },
    [editor.setStage] // eslint-disable-line react-hooks/exhaustive-deps
  )

  async function done() {
    try {
      onFinish(await editor.flatten())
    } catch (error) {
      onFail(error)
    }
  }

  const primaryLabel = editor.text.draft
    ? "Add"
    : editor.cropping
      ? "Apply"
      : "Done"
  const primaryDisabled =
    editor.busy || (!!editor.text.draft && !editor.text.ready)

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+8px)]">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 text-base font-bold text-white"
        >
          Cancel
        </button>

        {layers.dirty && !editor.cropping ? (
          <button
            type="button"
            onClick={layers.undo}
            aria-label="Undo"
            className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <Undo2Icon className="size-5" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={() =>
            void (editor.text.draft
              ? editor.commitText()
              : editor.cropping
                ? editor.applyCrop()
                : done())
          }
          disabled={primaryDisabled}
          className={cn(
            "flex h-9 items-center text-base font-bold text-white",
            primaryDisabled && "opacity-50"
          )}
        >
          {editor.busy ? <Spinner className="text-white" /> : primaryLabel}
        </button>
      </div>

      <div
        ref={measureStage}
        className="flex flex-1 items-center justify-center overflow-hidden"
      >
        {working && editor.cropping ? (
          <CropStage
            image={working}
            stage={editor.stage}
            aspect={editor.aspect}
            onChange={editor.setCrop}
          />
        ) : working && size.width > 0 ? (
          <div
            className="relative overflow-hidden"
            style={{ width: size.width, height: size.height }}
          >
            <div className="absolute inset-0" {...editor.gestures.handlers}>
              <EditorCanvas
                uri={working.uri}
                size={size}
                layers={layers.layers}
                live={
                  editor.gestures.live
                    ? {
                        tool: layers.tool,
                        path: editor.gestures.live,
                        color: layers.color,
                        width:
                          layers.tool === "blur"
                            ? layers.blurWidth
                            : layers.strokeWidth,
                      }
                    : null
                }
              />
            </div>
            {editor.text.draft ? (
              <TextDraft
                draft={editor.text.draft}
                color={layers.color}
                bounds={size}
                drag={editor.text.drag}
                onWrite={editor.text.write}
                onSettle={editor.text.settle}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <ToolRail
          tool={layers.tool}
          onTool={(next) => void editor.chooseTool(next)}
          color={layers.color}
          onColor={layers.setColor}
          size={
            layers.tool === "text"
              ? layers.textSize
              : layers.tool === "blur"
                ? layers.blurWidth
                : layers.strokeWidth
          }
          onSize={(next) => {
            if (layers.tool === "text") {
              layers.setTextSize(next)
              editor.text.resize(next)
            } else if (layers.tool === "blur") layers.setBlurWidth(next)
            else layers.setStrokeWidth(next)
          }}
          ratio={editor.ratio}
          onRatio={editor.setRatio}
          onRotate={() => void editor.rotate()}
        />
      </div>
    </div>
  )
}
