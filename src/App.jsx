import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Lugares from './pages/Lugares'
import Eventos from './pages/Eventos'
import Feed from './pages/Feed'
import Detail from './pages/Detail'
import Nearby from './pages/Nearby'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'
import Settings from './pages/Settings'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPlaces from './pages/admin/Places'
import AdminEvents from './pages/admin/Events'
import AdminAdvertisers from './pages/admin/Advertisers'
import AdminLogin from './pages/admin/Login'
import { AdminGuard } from './components/admin/AdminGuard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/lugares" element={<Lugares />} />
        <Route path="/lugares/:categoria" element={<Lugares />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/local/:slug" element={<Detail type="place" />} />
        <Route path="/evento/:slug" element={<Detail type="event" />} />
        <Route path="/perto-de-mim" element={<Nearby />} />

        {/* Auth de usuários */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/verificar-email" element={<VerifyEmail />} />

        {/* Configurações e onde estou */}
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="/onde-estou" element={<Nearby />} />

        {/* Legado — redireciona explorar para lugares */}
        <Route path="/explorar" element={<Navigate to="/lugares" replace />} />
        <Route path="/explorar/:cat" element={<Navigate to="/lugares" replace />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/locais" element={<AdminGuard><AdminPlaces /></AdminGuard>} />
        <Route path="/admin/eventos" element={<AdminGuard><AdminEvents /></AdminGuard>} />
        <Route path="/admin/anunciantes" element={<AdminGuard><AdminAdvertisers /></AdminGuard>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
