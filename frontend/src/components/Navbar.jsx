import { Link } from 'react-router-dom'
import { Users, Box, ClipboardList, Truck, Heart, Repeat } from 'lucide-react'

const items = [
  { to: '/products', label: 'Ingredientes', icon: Box, bg: 'bg-yellow-50', color: 'text-yellow-600' },
  { to: '/inventory', label: 'Materiales', icon: ClipboardList, bg: 'bg-green-50', color: 'text-green-600' },
  { to: '/users', label: 'Usuarios', icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
  { to: '/orders', label: 'Pedidos', icon: Truck, bg: 'bg-blue-50', color: 'text-blue-600' },
  { to: '/delivery-notes', label: 'Albaranes', icon: Repeat, bg: 'bg-red-50', color: 'text-red-600' },
  { to: '/providers', label: 'Proveedores', icon: Heart, bg: 'bg-indigo-50', color: 'text-indigo-600' },
]

export default function Navbar() {
  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8 py-6 flex justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 place-items-center w-full max-w-4xl">
        {items.map((it) => {
          const Icon = it.icon
          return (
            <Link key={it.to} to={it.to} className="flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-2xl shadow-sm hover:shadow-md w-full max-w-[220px]">
              <div className={`p-3 rounded-lg ${it.bg}`}>
                <Icon className={`w-10 h-10 ${it.color}`} />
              </div>
              <div className="text-lg font-medium text-cifp-neutral-700">{it.label}</div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
