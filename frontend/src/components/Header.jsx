import { User } from 'lucide-react'
import { useAuth } from '../contexts/AuthProvider'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cifp-blue rounded-sm flex items-center justify-center text-white font-bold">LE</div>
          <div>
            <div className="text-sm text-cifp-neutral-500">Jefe de Economato</div>
            <div className="text-lg font-semibold text-cifp-neutral-900">SmartEconomato</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-cifp-neutral-100">
            <User className="w-5 h-5 text-cifp-neutral-700" />
            <span className="text-sm text-cifp-neutral-700">{user?.nombre || user?.email || 'Perfil'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
