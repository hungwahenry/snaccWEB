"use client"

import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

function Toolbar({ editor }: { editor: Editor }) {
  const items = [
    {
      icon: Bold,
      label: "Bold",
      active: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      label: "Italic",
      active: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      active: editor.isActive("strike"),
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      active: editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      active: editor.isActive("heading", { level: 3 }),
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      icon: List,
      label: "Bullet list",
      active: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      active: editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: Quote,
      label: "Quote",
      active: editor.isActive("blockquote"),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
  ]

  return (
    <div className="border-b flex flex-wrap items-center gap-1 p-2">
      {items.map((item) => (
        <Toggle
          key={item.label}
          size="sm"
          pressed={item.active}
          onPressedChange={item.run}
          aria-label={item.label}
        >
          <item.icon className="size-4" />
        </Toggle>
      ))}
      <div className="bg-border mx-1 h-5 w-px" />
      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={() => editor.chain().focus().undo().run()}
        aria-label="Undo"
      >
        <Undo2 className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={() => editor.chain().focus().redo().run()}
        aria-label="Redo"
      >
        <Redo2 className="size-4" />
      </Toggle>
    </div>
  )
}

export function RichTextEditor({
  content,
  onChange,
}: {
  content: unknown
  onChange: (json: unknown, html: string) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: (content as object) ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "snacc-prose min-h-[320px] px-4 py-3 focus:outline-none" },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON(), editor.getHTML()),
  })

  if (!editor) {
    return <div className="border-input h-96 rounded-xl border" />
  }

  return (
    <div className="border-input overflow-hidden rounded-xl border">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
