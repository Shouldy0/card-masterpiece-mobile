// Diagnostic global handler
if (typeof window !== "undefined") {
  window.onerror = function(msg, url, line, col, error) {
    const errorInfo = `CRITICAL JS ERROR: ${msg} \nLine: ${line} \nStack: ${error?.stack}`;
    console.error(errorInfo);
    // If we are on the error screen, we could potentially show this info
    return false;
  };
}

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
      <div className="max-w-xs">
        <h1 className="text-2xl mb-4 gold-text">ERRORE DI SINCRONIZZAZIONE</h1>
        <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-widest">Dettaglio Tecnico:</p>
        <div className="bg-card/40 p-3 rounded-xl border border-gold/20 mb-6 max-h-60 overflow-auto">
          <p className="text-[8px] text-rose font-mono break-all text-left uppercase whitespace-pre-wrap">
            {error instanceof Error ? `${error.message}\n\nSTACK:\n${error.stack}` : JSON.stringify(error, null, 2)}
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="w-full py-3 bg-mystic/40 ring-1 ring-gold/50 rounded-full text-[10px] uppercase tracking-widest font-black active:scale-95 transition-all"
        >
          Riconnetti
        </button>
      </div>
    </div>
  )
})

const rootElement = document.getElementById('root')!;
ReactDOM.createRoot(rootElement).render(
  <RouterProvider router={router} />
)
