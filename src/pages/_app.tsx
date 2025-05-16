import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import ThemeToggle from "@/components/ThemeToggle";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <ErrorBoundary>
          <header className="container">
              <div className="no-flex-on-mobile" style={{justifyContent: "space-between", alignItems: "center"}}>
                  <hgroup>
                  <h1>EcoAlerts 🌿</h1>
                  <p>Suivez les conditions environnementales près de chez vous</p>
                  </hgroup>
                  <ThemeToggle />
              </div>
          </header>
          <main className="container">
              <Component {...pageProps} />
          </main>
          <footer className="container">
              <small>Made with ❤ ©2025 - v0.0.1</small>
          </footer>
      </ErrorBoundary>
  )
}
