import { useNavigate } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { Box, AlertCircle, ClipboardList, Users, Truck, Repeat, Heart, ArrowRight, X } from 'lucide-react'
import { Card, Button } from '../../components/ui'
import { getIngredients } from '../../services/products.service'
import { mockProducts } from '../../services/products.mock'
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

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [allProducts, setAllProducts] = useState([])
    const [loadError, setLoadError] = useState(false)

    // Load real ingredients from backend
    useEffect(() => {
        getIngredients()
            .then(data => setAllProducts(data))
            .catch(() => {
                setLoadError(true)
                setAllProducts(mockProducts)
            })
    }, [])

    // Limit to 7 products for kiosk mode
    const displayProducts = useMemo(() => {
        return allProducts.slice(0, 7)
    }, [allProducts])

    const hasMore = allProducts.length > 7

    return (
        <div className="space-y-6 short:space-y-3">
            {/* Quick Detail Modal */}
            {isModalOpen && selectedProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 short:p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-start justify-between mb-5 short:mb-3">
                            <div>
                                <h2 className="text-xl font-bold text-cifp-neutral-900 short:text-base leading-tight">
                                    {selectedProduct.nombre}
                                </h2>
                                <p className="text-sm text-cifp-neutral-500 font-mono mt-1">
                                    {selectedProduct.sku}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="ml-3 flex-shrink-0 p-2 rounded-xl bg-cifp-neutral-100 hover:bg-cifp-neutral-200 text-cifp-neutral-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label="Cerrar"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Details */}
                        <dl className="grid grid-cols-2 gap-3 short:gap-2 mb-6 short:mb-4">
                            <div className="bg-cifp-neutral-50 rounded-lg p-3 short:p-2">
                                <dt className="text-xs font-semibold text-cifp-neutral-500 uppercase tracking-wider">Stock</dt>
                                <dd className={`text-lg font-bold mt-0.5 short:text-base ${selectedProduct.stock < selectedProduct.stockMinimo ? 'text-cifp-red' : 'text-cifp-neutral-900'}`}>
                                    {selectedProduct.stock} <span className="text-sm font-normal text-cifp-neutral-500">{selectedProduct.unidad}</span>
                                </dd>
                            </div>
                            <div className="bg-cifp-neutral-50 rounded-lg p-3 short:p-2">
                                <dt className="text-xs font-semibold text-cifp-neutral-500 uppercase tracking-wider">Categoría</dt>
                                <dd className="text-base font-semibold text-cifp-neutral-900 mt-0.5 short:text-sm truncate">
                                    {selectedProduct.categoria || '—'}
                                </dd>
                            </div>
                            <div className="bg-cifp-neutral-50 rounded-lg p-3 short:p-2">
                                <dt className="text-xs font-semibold text-cifp-neutral-500 uppercase tracking-wider">Precio</dt>
                                <dd className="text-base font-semibold text-cifp-neutral-900 mt-0.5 short:text-sm">
                                    €{selectedProduct.precio?.toFixed(2) ?? '—'}
                                </dd>
                            </div>
                            <div className="bg-cifp-neutral-50 rounded-lg p-3 short:p-2">
                                <dt className="text-xs font-semibold text-cifp-neutral-500 uppercase tracking-wider">Stock Mín.</dt>
                                <dd className="text-base font-semibold text-cifp-neutral-900 mt-0.5 short:text-sm">
                                    {selectedProduct.stockMinimo} <span className="text-sm font-normal text-cifp-neutral-500">{selectedProduct.unidad}</span>
                                </dd>
                            </div>
                        </dl>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 short:gap-2">
                            <Button
                                onClick={() => { setIsModalOpen(false); navigate(`/products/${selectedProduct.id}`) }}
                                className="w-full justify-center min-h-[48px] text-base font-semibold short:min-h-[44px]"
                            >
                                Ver Detalle Completo
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setIsModalOpen(false)}
                                className="w-full justify-center min-h-[48px] text-base short:min-h-[44px]"
                            >
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
                    <p className="text-sm text-cifp-neutral-600 mt-1 short:text-xs">Vista rápida · Doble clic para ver detalles</p>
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
                                        onDoubleClick={() => { setSelectedProduct(product); setIsModalOpen(true) }}
                                        className={`transition-colors cursor-pointer ${isLowStock ? 'bg-cifp-red-light/10 hover:bg-cifp-red-light/20' : 'hover:bg-cifp-neutral-100'} `}
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
                            Mostrando <span className="font-semibold">{displayProducts.length}</span> de <span className="font-semibold">{allProducts.length}</span> productos.
                            {loadError && <span className="text-cifp-red ml-1">(mostrando datos de ejemplo — backend no disponible)</span>}
                            {!loadError && ' Usa el '}<span className="font-semibold">{!loadError && 'menú hamburguesa'}</span>{!loadError && ' para acceder a Gestión Avanzada o volver al Dashboard.'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Desktop Navigation Grid removed to avoid duplicating global Navbar */}
        </div>
    )
}
