/**
 * Markdown-lite → Tiptap JSON. Supports `##`/`###`/`####` headings, `-`/`*`
 * bullet lists, `1.` numbered lists, blank-line-separated paragraphs, and inline
 * `**bold**`, `*italic*`, `[label](url)`. The output renders through the same
 * <TiptapContent> component used for blog posts, so imported blog bodies and
 * editable legal pages share one renderer.
 */
export type TiptapNode = {
  type: string;
  content?: TiptapNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
};

function inline(text: string): TiptapNode[] {
  const out: TiptapNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ type: "text", text: text.slice(last, m.index) });
    if (m[2] != null) out.push({ type: "text", text: m[2], marks: [{ type: "bold" }] });
    else if (m[3] != null) out.push({ type: "text", text: m[3], marks: [{ type: "italic" }] });
    else if (m[4] != null)
      out.push({ type: "text", text: m[4], marks: [{ type: "link", attrs: { href: m[5] } }] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", text: text.slice(last) });
  return out.length ? out : [{ type: "text", text: "" }];
}

export function mdToTiptap(md: string): TiptapNode {
  const lines = (md ?? "").replace(/\r\n/g, "\n").split("\n");
  const content: TiptapNode[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) {
      content.push({ type: "paragraph", content: inline(para.join(" ")) });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      content.push({
        type: list.ordered ? "orderedList" : "bulletList",
        content: list.items.map((t) => ({
          type: "listItem",
          content: [{ type: "paragraph", content: inline(t) }],
        })),
      });
      list = null;
    }
  };
  const flush = () => {
    flushPara();
    flushList();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === "") {
      flush();
      continue;
    }
    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      content.push({
        type: "heading",
        attrs: { level: heading[1].length },
        content: inline(heading[2]),
      });
      continue;
    }
    const ul = /^[-*]\s+(.*)$/.exec(line);
    if (ul) {
      flushPara();
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(ul[1]);
      continue;
    }
    const ol = /^\d+[.)]\s+(.*)$/.exec(line);
    if (ol) {
      flushPara();
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ol[1]);
      continue;
    }
    flushList();
    para.push(line);
  }
  flush();

  if (!content.length) content.push({ type: "paragraph", content: [{ type: "text", text: "" }] });
  return { type: "doc", content };
}
