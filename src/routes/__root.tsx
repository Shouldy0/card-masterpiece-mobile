import { Outlet, Link, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { MusicProvider } from "@/components/MusicProvider";
import { getFirebase } from "@/lib/firebase";
import { useGame } from "@/game/store";
import { useEffect } from "react";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Reverie" },
      { name: "theme-color", content: "#0B0D17" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  console.log("REVERIE: RootComponent rendering");
  const setUser = useGame((s) => s.setUser);

  useEffect(() => {
    let unsub: any = null;
    async function setupAuth() {
      if (typeof window === "undefined") return;
      const { auth } = await getFirebase();
      const { onAuthStateChanged } = await import("firebase/auth");
      if (auth) {
        unsub = onAuthStateChanged(auth, async (user) => {
          setUser(user);
          if (user) {
            const { loadPlayerFromCloud } = await import("@/game/persistence");
            const cloudData = await loadPlayerFromCloud(user.uid);
            if (cloudData) {
              useGame.setState({ player: cloudData });
            } else {
              useGame.getState().resetPlayer();
            }
          }
        });
      }
    }
    setupAuth();
    return () => unsub?.();
  }, [setUser]);

  return (
    <div className="relative min-h-screen w-full bg-abyss">
      <main className="relative z-10 w-full min-h-screen">
        <Outlet />
      </main>
      <Toaster />
      <MusicProvider />
    </div>
  );
}

