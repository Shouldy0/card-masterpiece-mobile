console.log("REVERIE: Entry point reached");
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './styles.css'

const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  defaultErrorComponent: ({ error }) => (
    <div className="flex h-screen items-center justify-center bg-abyss text-gold p-4 text-center font-display">
      <div>
        <h1 className="text-2xl mb-4">ERRORE DI SINCRONIZZAZIONE</h1>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest">{error.message}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 ring-1 ring-gold/50 rounded-full text-[10px] uppercase tracking-widest">Riconnetti</button>
      </div>
    </div>
  )
})

console.log("REVERIE: Starting application...");

try {
  const rootElement = document.getElementById('root')!;
  if (!rootElement.innerHTML) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>,
    )
  }
} catch (e) {
  console.error("REVERIE: Fatal mount error", e);
}
