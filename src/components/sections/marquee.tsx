export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-foreground/10 py-5">
      <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-10 font-display text-2xl text-foreground/40">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            {t}
            <span className="text-amber">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
