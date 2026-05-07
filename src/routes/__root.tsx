import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { MusicProvider } from "@/components/MusicProvider";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
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
      { title: "Reverie — Il tuo coraggio, la tua mente" },
      { name: "description", content: "Un gioco di carte onirico ambientato nei territori della mente. Combatti contro la tua coscienza." },
      { name: "author", content: "Reverie" },
      { property: "og:title", content: "Reverie — Il tuo coraggio, la tua mente" },
      { property: "og:description", content: "Un gioco di carte onirico ambientato nei territori della mente. Combatti contro la tua coscienza." },
      { name: "theme-color", content: "#0B0D17" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Reverie — Il tuo coraggio, la tua mente" },
      { name: "twitter:description", content: "Un gioco di carte onirico ambientato nei territori della mente. Combatti contro la tua coscienza." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/af582e2c-5f55-4aaa-b442-5bb801e62518/id-preview-573adfc6--e63c8cda-7ed3-47f5-ac79-0e9688e67d50.lovable.app-1778052641800.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/af582e2c-5f55-4aaa-b442-5bb801e62518/id-preview-573adfc6--e63c8cda-7ed3-47f5-ac79-0e9688e67d50.lovable.app-1778052641800.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (<><Outlet /><Toaster /><MusicProvider /></>);
}

