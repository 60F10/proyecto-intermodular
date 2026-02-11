import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import fondoImg from '../assets/FondoLogin.png'

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cifp-neutral-50 relative" style={{ backgroundImage: `url(${fondoImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
      {/* overlay to reduce prominence of background for dashboard */}
      <div className="absolute inset-0 bg-white/70 dark:bg-black/40 pointer-events-none"></div>

      <div className="relative z-10 w-full">
        <Header />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full overflow-y-auto pb-28">
          <Outlet />
          <Navbar />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
