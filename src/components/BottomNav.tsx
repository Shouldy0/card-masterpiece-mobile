import { Link, useLocation } from "@tanstack/react-router";
import { Home, Library, BookOpen, ShoppingBag, Trophy, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/deck", label: "Mazzi", icon: Library },
  { to: "/collection", label: "Collezione", icon: BookOpen },
  { to: "/shop", label: "Negozio", icon: ShoppingBag },
  { to: "/ranked", label: "Ranked", icon: Trophy },
  { to: "/events", label: "Eventi", icon: Calendar },
  { to: "/profile", label: "Profilo", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 z-40 mt-auto border-t border-gold/20 bg-abyss/90 px-2 py-2 backdrop-blur-md">
      <ul className="flex items-end justify-between gap-1">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <li key={it.to} className="flex-1">
              <Link
                to={it.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[10px] font-medium transition-colors",
                  active ? "text-gold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className={cn("flex size-9 items-center justify-center rounded-full transition-all", active && "bg-mystic/30 ring-1 ring-gold/50 shadow-[0_0_18px_-4px_var(--mystic-glow)]")}>
                  <Icon className="h-4 w-4" />
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
