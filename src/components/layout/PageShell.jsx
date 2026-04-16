import Header from './Header'
import BottomNav from './BottomNav'

export default function PageShell({ children, hideNav = false }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full pb-24 px-4">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
