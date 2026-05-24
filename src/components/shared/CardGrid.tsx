"use client";

import { useGsapFadeIn } from "@/hooks/use-gsap";
import { cn } from "@/lib/utils";

interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function CardGrid({ children, columns = 3, className }: CardGridProps) {
  const ref = useGsapFadeIn();

  return (
    <div ref={ref} className={cn("grid gap-4 md:gap-6", gridCols[columns], className)}>
      {children}
    </div>
  );
}
