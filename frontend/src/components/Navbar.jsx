import { Users, Box, ClipboardList, Truck, Heart, Repeat } from 'lucide-react'
import NavigationGrid from './NavigationGrid'

const items = [
  { to: '/products', label: 'Ingredientes', icon: Box, bg: 'bg-yellow-50', color: 'text-yellow-600' },
  { to: '/inventory', label: 'Materiales', icon: ClipboardList, bg: 'bg-green-50', color: 'text-green-600' },
  { to: '/users', label: 'Usuarios', icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
  { to: '/orders', label: 'Pedidos', icon: Truck, bg: 'bg-blue-50', color: 'text-blue-600' },
  { to: '/delivery-notes', label: 'Albaranes', icon: Repeat, bg: 'bg-red-50', color: 'text-red-600' },
  { to: '/providers', label: 'Proveedores', icon: Heart, bg: 'bg-indigo-50', color: 'text-indigo-600' },
]

export default function Navbar() {
  return <NavigationGrid items={items} />
}
