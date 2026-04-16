import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Detail from './pages/Detail'
import Nearby from './pages/Nearby'
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
        <Route path="/explorar" element={<Explore />} />
        <Route path="/explorar/:categoria" element={<Explore />} />
        <Route path="/local/:slug" element={<Detail type="place" />} />
        <Route path="/evento/:slug" element={<Detail type="event" />} />
        <Route path="/perto-de-mim" element={<Nearby />} />

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
