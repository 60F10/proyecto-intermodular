import { Link } from 'react-router-dom'
import { Users, Box, ClipboardList, Truck, Heart, Repeat } from 'lucide-react'

const items = [
  { to: '/products', label: 'Ingredientes', icon: Box },
  { to: '/inventory', label: 'Materiales', icon: ClipboardList },
  { to: '/users', label: 'Usuarios', icon: Users },
  { to: '/orders', label: 'Pedidos', icon: Truck },
  { to: '/delivery-notes', label: 'Albaranes', icon: Repeat },
  { to: '/providers', label: 'Proveedores', icon: Heart },
]

export default function Navbar() {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {items.map((it) => {
          const Icon = it.icon
          return (
            <Link key={it.to} to={it.to} className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-lg shadow-sm hover:shadow-md">
              <div className="p-2 rounded-md bg-cifp-neutral-50">
                <Icon className="w-6 h-6 text-cifp-blue" />
              </div>
              <div className="text-sm text-cifp-neutral-700">{it.label}</div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
