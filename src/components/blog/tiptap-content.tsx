import * as React from "react";

type Mark = { type: string; attrs?: Record<string, unknown> };
type Node = {
  type: string;
  content?: Node[];
  text?: string;
  marks?: Mark[];
  attrs?: Record<string, unknown>;
};

function renderText(node: Node, key: React.Key): React.ReactNode {
  let el: React.ReactNode = node.text ?? "";
  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case "bold":
        el = <strong>{el}</strong>;
        break;
      case "italic":
        el = <em>{el}</em>;
        break;
      case "strike":
        el = <s>{el}</s>;
        break;
      case "code":
        el = <code className="rounded bg-muted px-1 py-0.5 text-[0.9em]">{el}</code>;
        break;
      case "link": {
        const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";
        const external = href.startsWith("http");
        el = (
          <a
            href={href}
            className="text-ocean underline underline-offset-2"
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {el}
          </a>
        );
        break;
      }
    }
  }
  return <React.Fragment key={key}>{el}</React.Fragment>;
}

function renderNode(node: Node, key: React.Key): React.ReactNode {
  const children = node.content?.map((c, i) => renderNode(c, i));
  switch (node.type) {
    case "doc":
      return <React.Fragment key={key}>{children}</React.Fragment>;
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const level = typeof node.attrs?.level === "number" ? node.attrs.level : 2;
      const Tag = `h${Math.min(Math.max(level, 2), 4)}` as "h2" | "h3" | "h4";
      return <Tag key={key}>{children}</Tag>;
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{node.content?.map((c) => c.text).join("") ?? ""}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "text":
      return renderText(node, key);
    default:
      return children ? <div key={key}>{children}</div> : null;
  }
}

/** Server-side renderer for stored Tiptap JSON → styled article content. */
export function TiptapContent({ content }: { content: unknown }) {
  if (!content || typeof content !== "object") return null;
  return (
    <div className="max-w-none text-[1.05rem] leading-relaxed text-foreground/90 [&_a]:text-ocean [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-amber [&_blockquote]:pl-5 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h4]:mt-6 [&_h4]:font-display [&_h4]:text-xl [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
      {renderNode(content as Node, "root")}
    </div>
  );
}
