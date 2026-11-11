import Header from './Header'
import BottomNav from './BottomNav'

// fit: a página ocupa exatamente a tela, sem rolar (Home)
// header: troca o cabeçalho padrão (telas internas com botão de voltar)
// overflow-x-clip (e não hidden): corta a tela que entra deslizando de lado sem
// criar rolagem horizontal nem soltar o cabeçalho preso no topo
export default function PageShell({ children, hideNav = false, fit = false, header }) {
  return (
    <div className={fit ? 'h-dvh flex flex-col overflow-hidden' : 'min-h-dvh flex flex-col overflow-x-clip'}>
      {header ?? <Header />}
      <main
        // Telas internas (com cabeçalho próprio) já entram deslizando de lado
        className={`flex-1 max-w-2xl mx-auto w-full px-4 ${header ? '' : 'page-enter'} ${
          fit ? 'min-h-0 flex flex-col overflow-y-auto pb-nav' : 'pb-24'
        }`}
      >
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
