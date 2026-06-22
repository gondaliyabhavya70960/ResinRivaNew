import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

/** Centered max-width wrapper with responsive gutters. */
export function Container({
  as: Comp = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Comp
      className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
