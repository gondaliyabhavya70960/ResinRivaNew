import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  /** lowercase eyebrow label */
  eyebrow?: string;
  /** numbered section marker, e.g. "01" */
  index?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** render children without the inner Container */
  bare?: boolean;
} & Omit<React.HTMLAttributes<HTMLElement>, "title">;

/** Vertical-rhythm section with an optional editorial header. */
export function Section({
  id,
  className,
  containerClassName,
  children,
  eyebrow,
  index,
  title,
  description,
  bare = false,
  ...props
}: SectionProps) {
  const hasHeader = eyebrow || index || title || description;

  const header = hasHeader ? (
    <header className="mb-10 max-w-2xl sm:mb-14">
      {(eyebrow || index) && (
        <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {index && <span className="font-display text-sm text-amber">{index}</span>}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}
      {title && (
        <h2 className="font-display text-3xl leading-[1.05] text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
    </header>
  ) : null;

  return (
    <section id={id} className={cn("py-20 sm:py-28", className)} {...props}>
      {bare ? (
        children
      ) : (
        <Container className={containerClassName}>
          {header}
          {children}
        </Container>
      )}
    </section>
  );
}
