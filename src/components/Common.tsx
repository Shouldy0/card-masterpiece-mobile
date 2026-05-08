import React from "react";
import { cn } from "@/lib/utils";

export function MobileFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[440px] flex-col bg-abyss/40">
      <div className={cn("relative z-10 flex flex-1 flex-col w-full", className)}>
        {children}
      </div>
    </div>
  );
}

export function FocusGems({ value, max }: { value: number; max: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-display text-xs text-gold">{value}/{max}</span>
      <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Focus</span>
      <div className="ml-1 flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "size-2.5 rotate-45",
              i < value
                ? "bg-gradient-to-br from-mystic-glow to-mystic shadow-[0_0_8px_-1px_var(--mystic-glow)]"
                : "border border-mystic/40 bg-abyss/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function Hexagon({ children, color = "rose", size = "md" }: { children: React.ReactNode; color?: "rose" | "gold" | "mystic"; size?: "sm" | "md" | "lg" }) {
  const colors = {
    rose: "bg-gradient-to-br from-rose to-[oklch(0.4_0.18_15)]",
    gold: "bg-gradient-to-br from-gold to-gold-dim text-abyss",
    mystic: "bg-gradient-to-br from-mystic-glow to-mystic",
  } as const;
  const sizes = { sm: "size-7 text-xs", md: "size-9 text-sm", lg: "size-12 text-base" } as const;
  return (
    <div
      className={cn("flex items-center justify-center font-display text-foreground ring-1 ring-gold/60 shadow-md", colors[color], sizes[size])}
      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
    >
      {children}
    </div>
  );
}
