import Header from './Header'
import BottomNav from './BottomNav'

/**
 * Wrapper padrão para páginas públicas:
 * header fixo no topo + espaço para bottom nav.
 */
export default function PageShell({ children, hideNav = false }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full pb-20 px-4">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
