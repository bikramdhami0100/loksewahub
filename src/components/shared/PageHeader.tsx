"use client";

import { useGsapFadeIn } from "@/hooks/use-gsap";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  const ref = useGsapFadeIn();

  return (
    <div ref={ref} className="mb-8 space-y-2">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p>
      )}
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}
