import { Users, Box, ClipboardList, Truck, Heart, Repeat, ChevronLeft, FileText, Archive } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const items = [
  { to: '/products', label: 'Ingredientes', icon: Box, bg: 'bg-yellow-50', color: 'text-yellow-600' },
  { to: '/inventory', label: 'Materiales', icon: ClipboardList, bg: 'bg-green-50', color: 'text-green-600' },
  { to: '/recipes', label: 'Recetas', icon: FileText, bg: 'bg-amber-50', color: 'text-amber-600' },
  { to: '/returns', label: 'Bajas/Devoluciones', icon: Archive, bg: 'bg-pink-50', color: 'text-pink-600' },
  { to: '/orders', label: 'Pedidos', icon: Truck, bg: 'bg-blue-50', color: 'text-blue-600' },
  { to: '/delivery-notes', label: 'Albaranes', icon: Repeat, bg: 'bg-red-50', color: 'text-red-600' },
  { to: '/providers', label: 'Proveedores', icon: Heart, bg: 'bg-indigo-50', color: 'text-indigo-600' },
]

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8 py-6 flex justify-center">
      <div className="flex items-start w-full max-w-4xl gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 place-items-center w-full">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md w-full max-w-[220px] min-h-[150px]"
            aria-label="Volver atrás"
          >
            <div className="p-3 rounded-lg bg-cifp-neutral-100 flex items-center justify-center w-12 h-12">
              <ChevronLeft className="w-7 h-7 text-cifp-neutral-700" />
            </div>
            <div className="text-sm sm:text-base font-medium text-cifp-neutral-700 text-center leading-tight break-words">Volver atrás</div>
          </button>
          {items.map((it) => {
            const Icon = it.icon
            return (
              <Link key={it.to} to={it.to} className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md w-full max-w-[220px] min-h-[150px]">
                <div className={`p-3 rounded-lg ${it.bg} flex items-center justify-center w-12 h-12`}>
                  <Icon className={`w-7 h-7 ${it.color}`} />
                </div>
                <div className="text-sm sm:text-base font-medium text-cifp-neutral-700 text-center leading-tight break-words">{it.label}</div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
