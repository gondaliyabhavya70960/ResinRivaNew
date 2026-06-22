"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type JSONContent = Record<string, unknown>;
const EMPTY: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export function TiptapEditor({
  name,
  defaultContent,
}: {
  name: string;
  defaultContent?: JSONContent | null;
}) {
  const initial =
    defaultContent && Object.keys(defaultContent).length ? defaultContent : EMPTY;
  const [json, setJson] = React.useState<JSONContent>(initial);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initial,
    immediatelyRender: false,
    editorProps: { attributes: { class: "min-h-64 focus:outline-none" } },
    onUpdate: ({ editor }) => setJson(editor.getJSON() as JSONContent),
  });

  return (
    <div className="rounded-lg border bg-card">
      <input type="hidden" name={name} value={JSON.stringify(json)} />
      {editor && (
        <>
          <div className="flex flex-wrap gap-1 border-b p-2">
            <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
              <Bold className="size-4" />
            </Btn>
            <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
              <Italic className="size-4" />
            </Btn>
            <Btn
              on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive("heading", { level: 2 })}
            >
              <Heading2 className="size-4" />
            </Btn>
            <Btn
              on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive("heading", { level: 3 })}
            >
              <Heading3 className="size-4" />
            </Btn>
            <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
              <List className="size-4" />
            </Btn>
            <Btn on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
              <ListOrdered className="size-4" />
            </Btn>
            <Btn on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
              <Quote className="size-4" />
            </Btn>
            <Btn on={() => editor.chain().focus().undo().run()} active={false}>
              <Undo2 className="size-4" />
            </Btn>
            <Btn on={() => editor.chain().focus().redo().run()} active={false}>
              <Redo2 className="size-4" />
            </Btn>
          </div>
          <EditorContent
            editor={editor}
            className="px-4 py-3 text-sm [&_blockquote]:border-l-2 [&_blockquote]:border-amber [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-3 [&_h2]:font-display [&_h2]:text-2xl [&_h3]:mt-2 [&_h3]:font-display [&_h3]:text-xl [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
          />
        </>
      )}
    </div>
  );
}

function Btn({
  on,
  active,
  children,
}: {
  on: () => void;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={on}
      className={cn(
        "grid size-8 place-items-center rounded transition-colors",
        active ? "bg-ocean text-ivory" : "text-foreground/70 hover:bg-foreground/5",
      )}
    >
      {children}
    </button>
  );
}
