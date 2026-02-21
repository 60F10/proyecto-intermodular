import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MobileMenu from '../components/MobileMenu'
import fondoImg from '../assets/FondoLogin.png'

function MainLayout() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Focus Mode: reserved for explicit kiosk routes OR routes ending in /full (as requested).
  const isFocusMode = location.pathname.includes('/kiosk') || location.pathname.endsWith('/full')

  return (
    <div
      className="min-h-screen flex flex-col bg-cifp-neutral-50 relative"
      style={{
        backgroundImage: `url(${fondoImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* overlay to reduce prominence of background for dashboard */}
      <div className="absolute inset-0 bg-white/70 dark:bg-black/40 pointer-events-none"></div>

      <div className="relative z-10 w-full">
        <Header showMenuButton={isFocusMode} onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="flex-grow max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full overflow-y-auto pb-28">
          <Outlet />
          {/* Conditionally render Navbar: hide in Focus Mode */}
          {!isFocusMode && <Navbar />}
        </main>

        <Footer />
      </div>

      {/* Mobile Menu for Focus Mode */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  )
}

export default MainLayout
