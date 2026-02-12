import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X, Plus, Edit, Trash2, ArrowLeft, Download, AlertTriangle } from 'lucide-react'
import { Card, Button, Input } from '../../components/ui'
import { useAuth } from '../../contexts/AuthProvider'
import { mockProducts, getCategories, getSuppliers, getLowStockProducts } from '../../services/products.mock'

export default function IngredientsFullPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    // State management
    const [products] = useState(mockProducts)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [providerFilter, setProviderFilter] = useState('all')
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')
    const [selectedIds, setSelectedIds] = useState([])
    const [showOnlyLowStock, setShowOnlyLowStock] = useState(false)

    // Get unique categories and providers
    const categories = useMemo(() => getCategories(), [])
    const suppliers = useMemo(() => getSuppliers(), [])

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = products

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase()
            filtered = filtered.filter(p =>
                p.nombre.toLowerCase().includes(searchLower) ||
                p.sku.toLowerCase().includes(searchLower)
            )
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.categoria === categoryFilter)
        }

        // Apply provider filter
        if (providerFilter !== 'all') {
            filtered = filtered.filter(p => p.proveedor === providerFilter)
        }

        // Apply low stock filter
        if (showOnlyLowStock) {
            filtered = filtered.filter(p => p.stock < p.stockMinimo)
        }

        // Apply sorting
        if (sortColumn) {
            filtered = [...filtered].sort((a, b) => {
                let aVal = a[sortColumn]
                let bVal = b[sortColumn]

                // Handle string comparison
                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase()
                    bVal = bVal.toLowerCase()
                }

                if (sortDirection === 'asc') {
                    return aVal > bVal ? 1 : -1
                } else {
                    return aVal < bVal ? 1 : -1
                }
            })
        }

        return filtered
    }, [products, search, categoryFilter, providerFilter, showOnlyLowStock, sortColumn, sortDirection])

    // Handlers
    const handleSort = (column) => {
        if (sortColumn === column) {
            // Toggle direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const handleResetFilters = () => {
        setSearch('')
        setCategoryFilter('all')
        setProviderFilter('all')
        setShowOnlyLowStock(false)
        setSortColumn(null)
        setSortDirection('asc')
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredProducts.map(p => p.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleExportCSV = () => {
        const dataToExport = selectedIds.length > 0
            ? filteredProducts.filter(p => selectedIds.includes(p.id))
            : filteredProducts

        console.log('📊 Exportar CSV:', dataToExport)
        console.log(`Total productos a exportar: ${dataToExport.length}`)
    }

    // Check if user is regular USER (not ADMIN)
    const isRegularUser = user?.role === 'USER'

    const SortIcon = ({ column }) => {
        if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4 opacity-50" />
        return sortDirection === 'asc'
            ? <ArrowUp className="w-4 h-4" />
            : <ArrowDown className="w-4 h-4" />
    }

    const lowStockCount = getLowStockProducts().length

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] short:h-[calc(100vh-8rem)] space-y-4 pb-4 short:space-y-2 short:pb-2">
            {/* Page Header with Back Button - FIXED */}
            <div className="flex items-center justify-between flex-shrink-0 short:py-0">
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-2 text-cifp-blue hover:text-cifp-blue-dark transition-colors short:text-sm"
                >
                    <ArrowLeft className="w-5 h-5 short:w-4 short:h-4" />
                    <span className="font-medium">Volver a Resumen</span>
                </button>

                {lowStockCount > 0 && (
                    <div className="flex items-center gap-2 bg-cifp-red-light/10 text-cifp-red px-4 py-2 rounded-lg short:px-2 short:py-1">
                        <AlertTriangle className="w-5 h-5 short:w-4 short:h-4" />
                        <span className="text-sm font-semibold short:text-xs">{lowStockCount} productos con stock crítico</span>
                    </div>
                )}
            </div>

            {/* Toolbar - FIXED */}
            <Card className="p-6 flex-shrink-0 short:p-3">
                <div className="space-y-4 short:space-y-2">
                    {/* Search and Filters Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 short:gap-2">
                        <Input
                            placeholder="Buscar por ID o Nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={Search}
                            className="w-full short:h-8 short:text-xs"
                        />

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cifp-blue/20 focus:border-cifp-blue short:h-8 short:px-2 short:py-1 short:text-xs"
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={providerFilter}
                            onChange={(e) => setProviderFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cifp-blue/20 focus:border-cifp-blue short:h-8 short:px-2 short:py-1 short:text-xs"
                        >
                            <option value="all">Todos los proveedores</option>
                            {suppliers.map(sup => (
                                <option key={sup} value={sup}>{sup}</option>
                            ))}
                        </select>

                        <Button onClick={handleResetFilters} variant="secondary" className="gap-2 short:h-8 short:text-xs short:px-2">
                            <X className="w-4 h-4 short:w-3 short:h-3" />
                            Resetear Filtros
                        </Button>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap items-center gap-3 short:gap-2">
                        <Button
                            variant="primary"
                            disabled={isRegularUser}
                            className="gap-2 short:h-8 short:text-xs short:px-2"
                            title={isRegularUser ? 'Solo administradores pueden crear productos' : ''}
                        >
                            <Plus className="w-4 h-4 short:hidden" />
                            Crear Producto
                        </Button>

                        <Button
                            variant="primary"
                            disabled={isRegularUser || selectedIds.length === 0}
                            className="gap-2 short:h-8 short:text-xs short:px-2"
                            title={isRegularUser ? 'Solo administradores pueden modificar productos' : 'Selecciona al menos un producto'}
                        >
                            <Edit className="w-4 h-4 short:hidden" />
                            Modificar Seleccionado
                        </Button>

                        <div className="ml-auto flex items-center gap-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={showOnlyLowStock}
                                    onChange={(e) => setShowOnlyLowStock(e.target.checked)}
                                    className="w-4 h-4 text-cifp-red focus:ring-cifp-red border-gray-300 rounded short:w-3 short:h-3"
                                />
                                <span className="text-sm font-medium text-cifp-neutral-700 short:text-xs">Solo stock crítico</span>
                            </label>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Data Grid with Internal Scroll - FLEXIBLE */}
            <Card className="flex-grow flex flex-col overflow-hidden min-h-0">
                <div className="flex-grow overflow-y-auto border-b border-cifp-neutral-200">
                    <table className="w-full">
                        <thead className="bg-cifp-neutral-100 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-4 py-3 text-left bg-cifp-neutral-100 short:px-2 short:py-1">
                                    <input
                                        type="checkbox"
                                        checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 text-cifp-blue focus:ring-cifp-blue border-gray-300 rounded short:w-3 short:h-3"
                                    />
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-semibold text-cifp-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-cifp-neutral-200 transition-colors bg-cifp-neutral-100 short:px-2 short:py-1 short:text-[10px]"
                                    onClick={() => handleSort('sku')}
                                >
                                    <div className="flex items-center gap-2">
                                        ID (SKU)
                                        <SortIcon column="sku" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-semibold text-cifp-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-cifp-neutral-200 transition-colors bg-cifp-neutral-100 short:px-2 short:py-1 short:text-[10px]"
                                    onClick={() => handleSort('nombre')}
                                >
                                    <div className="flex items-center gap-2">
                                        Nombre
                                        <SortIcon column="nombre" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-semibold text-cifp-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-cifp-neutral-200 transition-colors bg-cifp-neutral-100 short:px-2 short:py-1 short:text-[10px]"
                                    onClick={() => handleSort('categoria')}
                                >
                                    <div className="flex items-center gap-2">
                                        Categoría
                                        <SortIcon column="categoria" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-right text-xs font-semibold text-cifp-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-cifp-neutral-200 transition-colors bg-cifp-neutral-100 short:px-2 short:py-1 short:text-[10px]"
                                    onClick={() => handleSort('stock')}
                                >
                                    <div className="flex items-center justify-end gap-2">
                                        Stock
                                        <SortIcon column="stock" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-right text-xs font-semibold text-cifp-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-cifp-neutral-200 transition-colors bg-cifp-neutral-100 short:px-2 short:py-1 short:text-[10px]"
                                    onClick={() => handleSort('precio')}
                                >
                                    <div className="flex items-center justify-end gap-2">
                                        Precio (€)
                                        <SortIcon column="precio" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-right text-xs font-semibold text-cifp-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-cifp-neutral-200 transition-colors bg-cifp-neutral-100 short:px-2 short:py-1 short:text-[10px]"
                                    onClick={() => handleSort('rendimiento')}
                                >
                                    <div className="flex items-center justify-end gap-2">
                                        Rendimiento
                                        <SortIcon column="rendimiento" />
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-cifp-neutral-700 uppercase tracking-wider bg-cifp-neutral-100 short:px-2 short:py-1 short:text-[10px]">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-cifp-neutral-200">
                            {filteredProducts.map((product) => {
                                const isLowStock = product.stock < product.stockMinimo
                                const isSelected = selectedIds.includes(product.id)

                                return (
                                    <tr
                                        key={product.id}
                                        className={`transition-colors ${isLowStock
                                            ? 'bg-cifp-red-light/10 hover:bg-cifp-red-light/20'
                                            : isSelected
                                                ? 'bg-cifp-blue/5 hover:bg-cifp-blue/10'
                                                : 'hover:bg-cifp-neutral-50'
                                            } short:text-xs`}
                                    >
                                        <td className="px-4 py-3 short:px-2 short:py-1">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelectOne(product.id)}
                                                className="w-4 h-4 text-cifp-blue focus:ring-cifp-blue border-gray-300 rounded short:w-3 short:h-3"
                                            />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-cifp-neutral-600 short:px-2 short:py-1 short:text-[10px]">
                                            {product.sku}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-cifp-neutral-900 short:px-2 short:py-1 short:text-[10px]">
                                            {product.nombre}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-cifp-neutral-600 short:px-2 short:py-1 short:text-[10px]">
                                            {product.categoria}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right short:px-2 short:py-1">
                                            <span className={`font-semibold short:text-[10px] ${isLowStock ? 'text-cifp-red' : 'text-cifp-neutral-700'}`}>
                                                {product.stock} {product.unidad}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-cifp-neutral-700 short:px-2 short:py-1 short:text-[10px]">
                                            €{product.precio.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-cifp-neutral-600 short:px-2 short:py-1 short:text-[10px]">
                                            {product.rendimiento.toFixed(3)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center short:px-2 short:py-1">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-1 text-cifp-blue hover:bg-cifp-blue/10 rounded transition-colors" title="Editar">
                                                    <Edit className="w-4 h-4 short:w-3 short:h-3" />
                                                </button>
                                                <button
                                                    className="p-1 text-cifp-red hover:bg-cifp-red/10 rounded transition-colors"
                                                    disabled={isRegularUser}
                                                    title={isRegularUser ? 'Solo administradores pueden eliminar' : 'Eliminar'}
                                                >
                                                    <Trash2 className="w-4 h-4 short:w-3 short:h-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer - FIXED at bottom of card */}
                <div className="px-6 py-4 bg-cifp-neutral-50 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 short:px-3 short:py-2 short:gap-2">
                    <div className="text-sm text-cifp-neutral-600 short:text-xs">
                        <span className="font-semibold">{filteredProducts.length}</span> productos
                        {selectedIds.length > 0 && (
                            <> | <span className="font-semibold text-cifp-blue">{selectedIds.length}</span> seleccionados</>
                        )}
                    </div>

                    <div className="flex items-center gap-3 short:gap-2">
                        <Button
                            variant="secondary"
                            onClick={handleExportCSV}
                            className="gap-2 short:h-8 short:text-xs short:px-2"
                        >
                            <Download className="w-4 h-4 short:w-3 short:h-3" />
                            Exportar CSV
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
