import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// High-level error logging for deployment debugging
window.onerror = function (message, source, lineno, colno, error) {
  console.error('GLOBAL ERROR:', message, 'at', source, lineno, colno);
};

import { Analytics } from "@vercel/analytics/react"
import ErrorBoundary from './components/ErrorBoundary.jsx'

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find root element');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
        <Analytics />
      </ErrorBoundary>
    </StrictMode>,
  )
}
