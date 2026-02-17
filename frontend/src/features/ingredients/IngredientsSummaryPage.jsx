import { useNavigate } from 'react-router-dom'
import { Box, AlertCircle, ClipboardList, Users, Truck, Repeat, Heart, ArrowRight } from 'lucide-react'
import { Card, Button } from '../../components/ui'
import { mockProducts } from '../../services/products.mock'
import { useMemo } from 'react'
import NavigationGrid from '../../components/NavigationGrid'

const navigationItems = [
    { to: '/products', label: 'Ingredientes', icon: Box, bg: 'bg-yellow-50', color: 'text-yellow-600' },
    { to: '/inventory', label: 'Materiales', icon: ClipboardList, bg: 'bg-green-50', color: 'text-green-600' },
    { to: '/users', label: 'Usuarios', icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
    { to: '/orders', label: 'Pedidos', icon: Truck, bg: 'bg-blue-50', color: 'text-blue-600' },
    { to: '/delivery-notes', label: 'Albaranes', icon: Repeat, bg: 'bg-red-50', color: 'text-red-600' },
    { to: '/providers', label: 'Proveedores', icon: Heart, bg: 'bg-indigo-50', color: 'text-indigo-600' },
]

export default function IngredientsSummaryPage() {
    const navigate = useNavigate()

    // Limit to 7 products for kiosk mode, prioritize low stock (stock < stockMinimo)
    const displayProducts = useMemo(() => {
        const sorted = [...mockProducts].sort((a, b) => {
            // Prioritize low stock products
            const aLow = a.stock < a.stockMinimo
            const bLow = b.stock < b.stockMinimo
            if (aLow && !bLow) return -1
            if (!aLow && bLow) return 1
            return 0
        })
        return sorted.slice(0, 7)
    }, [])

    const hasMore = mockProducts.length > 7

    return (
        <div className="space-y-6 short:space-y-3">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-3 short:gap-2">
                <div className="flex items-center gap-3">
                    <Box className="h-8 w-8 text-cifp-blue short:h-6 short:w-6" />
                    <h1 className="text-3xl font-bold text-cifp-neutral-900 short:text-xl">Ingredientes</h1>
                </div>

                {/* Advanced Management Button - Always Visible */}
                <Button
                    onClick={() => navigate('/products/full')}
                    className="flex items-center gap-2 short:text-xs short:px-2 short:py-1"
                >
                    <span className="short:hidden">Gestión Avanzada</span>
                    <span className="hidden short:inline">Gestión Avanzada</span>
                    <ArrowRight className="w-4 h-4 short:w-3 short:h-3" />
                </Button>
            </div>

            {/* Summary Table */}
            <Card className="overflow-hidden flex flex-col max-h-[calc(100vh-16rem)] short:max-h-[calc(100vh-8rem)]">
                <div className="px-6 py-4 bg-cifp-neutral-50 border-b border-cifp-neutral-200 flex-shrink-0 short:px-4 short:py-2">
                    <h2 className="text-lg font-semibold text-cifp-neutral-900 short:text-base">Resumen de Inventario</h2>
                    <p className="text-sm text-cifp-neutral-600 mt-1 short:text-xs">Vista rápida de productos (prioridad: stock crítico)</p>
                </div>

                <div className="overflow-y-auto flex-grow">
                    <table className="w-full">
                        <thead className="bg-cifp-neutral-100 text-cifp-neutral-700 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-cifp-neutral-100 short:px-4 short:py-2">ID (SKU)</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-cifp-neutral-100 short:px-4 short:py-2">Nombre</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider bg-cifp-neutral-100 short:px-4 short:py-2">Stock</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-cifp-neutral-200">
                            {displayProducts.map((product) => {
                                const isLowStock = product.stock < product.stockMinimo
                                return (
                                    <tr
                                        key={product.id}
                                        className={`transition-colors ${isLowStock ? 'bg-cifp-red-light/10 hover:bg-cifp-red-light/20' : 'hover:bg-cifp-neutral-50'} `}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-cifp-neutral-600 short:px-4 short:py-2 short:text-xs">{product.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cifp-neutral-900 short:px-4 short:py-2 short:text-xs">{product.nombre}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right short:px-4 short:py-2">
                                            <span className={`font-semibold short:text-xs ${isLowStock ? 'text-cifp-red' : 'text-cifp-neutral-700'} `}>
                                                {product.stock} {product.unidad}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Info Message - No navigation buttons */}
                <div className="px-6 py-4 bg-cifp-neutral-50 border-t border-cifp-neutral-200 flex-shrink-0 short:px-4 short:py-2">
                    <div className="flex items-start gap-2 text-cifp-neutral-600 text-sm short:text-xs">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 short:w-3 short:h-3" />
                        <p>
                            Mostrando <span className="font-semibold">{displayProducts.length}</span> de <span className="font-semibold">{mockProducts.length}</span> productos.
                            Usa el <span className="font-semibold">menú hamburguesa</span> para acceder a Gestión Avanzada o volver al Dashboard.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Desktop Navigation Grid removed to avoid duplicating global Navbar */}
        </div>
    )
}
