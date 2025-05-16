import '@/styles/globals.scss'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
      <>
          <header className="container">
              <hgroup>
              <h1>EcoAlerts 🌿</h1>
              <p>Suivez les conditions environnementales près de chez vous</p>
              </hgroup>
          </header>
          <main className="container">
              <Component {...pageProps} />
          </main>
          <footer className="container">
              <small>Made with ❤ ©2025 - v0.0.1</small>
          </footer>
      </>
  )
}
