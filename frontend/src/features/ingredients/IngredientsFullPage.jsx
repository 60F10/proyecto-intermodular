import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X, Plus, Edit, Trash2, ArrowLeft, Download, AlertTriangle, Eye } from 'lucide-react'
import { Card, Button, Input } from '../../components/ui'
import { useAuth } from '../../contexts/AuthProvider'
import { mockProducts } from '../../services/products.mock'
import apiFetch from '../../services/api'

export default function IngredientsFullPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    // State management
    const [products, setProducts] = useState(mockProducts)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [providerFilter, setProviderFilter] = useState('all')
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')
    const [selectedIds, setSelectedIds] = useState([])
    const [showOnlyLowStock, setShowOnlyLowStock] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editProduct, setEditProduct] = useState(null)

    // Get unique categories and providers from loaded products
    const categories = useMemo(() => [...new Set(products.map(p => p.categoria || ''))].filter(Boolean).sort(), [products])
    const suppliers = useMemo(() => [...new Set(products.map(p => p.proveedor || ''))].filter(Boolean).sort(), [products])

    // Load products from backend on mount (fallback to mock on error)
    useEffect(() => {
        let mounted = true
        apiFetch('/products?limit=1000')
            .then(res => {
                const items = res?.data || res
                if (mounted && Array.isArray(items)) setProducts(items)
            })
            .catch(() => {
                // keep mockProducts if backend not available
                setProducts(mockProducts)
            })
        return () => { mounted = false }
    }, [])

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = products

        // Apply search filter (match any field)
        if (search) {
            const searchLower = search.toLowerCase()
            filtered = filtered.filter(p =>
                Object.values(p).some(val => String(val).toLowerCase().includes(searchLower))
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

        if (dataToExport.length === 0) return

        // Build CSV
        const keys = ['id', 'sku', 'nombre', 'categoria', 'proveedor', 'stock', 'unidad', 'precio', 'rendimiento', 'activo']
        const header = keys.join(',')
        const rows = dataToExport.map(p => keys.map(k => {
            const v = p[k]
            if (typeof v === 'string') return `"${String(v).replace(/"/g, '""')}"`
            return String(v)
        }).join(','))

        const csvContent = [header, ...rows].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `productos_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handleOpenEdit = (product) => {
        setEditProduct(product)
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setEditProduct(null)
        setIsEditing(false)
    }

    const [deleteTarget, setDeleteTarget] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleSaveEdit = async (updated) => {
        if (!updated) return
        try {
            // Determine create vs update by presence of id and whether it looks like a client-only id
            const isExisting = updated.id && products.some(p => p.id === updated.id && !String(p.id).startsWith('id_'))
            if (isExisting) {
                const res = await apiFetch(`/products/${updated.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updated),
                })
                setProducts(products.map(p => p.id === res.id ? res : p))
            } else {
                const res = await apiFetch('/products', {
                    method: 'POST',
                    body: JSON.stringify(updated),
                })
                setProducts([res, ...products])
            }
            handleCloseEdit()
        } catch (err) {
            alert(`Error: ${err?.body?.message || err.message}`)
        }
    }

    const handleDelete = async (id) => {
        if (isRegularUser) return
        setDeleteTarget(id)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        if (!deleteTarget) return
        try {
            await apiFetch(`/products/${deleteTarget}`, { method: 'DELETE' })
            setProducts(products.filter(p => p.id !== deleteTarget))
            setSelectedIds(selectedIds.filter(sid => sid !== deleteTarget))
            setShowDeleteModal(false)
            setDeleteTarget(null)
        } catch (err) {
            alert(`Error: ${err?.body?.message || err.message}`)
        }
    }

    // Check if user is regular USER (not ADMIN)
    const isRegularUser = user?.role === 'USER'

    const SortIcon = ({ column }) => {
        if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4 opacity-50" />
        return sortDirection === 'asc'
            ? <ArrowUp className="w-4 h-4" />
            : <ArrowDown className="w-4 h-4" />
    }

    const lowStockCount = products.filter(p => p.stock < p.stockMinimo).length

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] short:h-[calc(100vh-8rem)] space-y-4 pb-4 short:space-y-2 short:pb-2">
            {/* Edit/Create Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4">{editProduct?.id ? 'Editar Producto' : 'Crear Producto'}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input value={editProduct?.nombre || ''} onChange={(e) => setEditProduct({ ...editProduct, nombre: e.target.value })} placeholder="Nombre" />
                            <Input value={editProduct?.sku || ''} onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })} placeholder="SKU" />
                            <Input value={editProduct?.categoria || ''} onChange={(e) => setEditProduct({ ...editProduct, categoria: e.target.value })} placeholder="Categoría" />
                            <Input value={editProduct?.proveedor || ''} onChange={(e) => setEditProduct({ ...editProduct, proveedor: e.target.value })} placeholder="Proveedor" />
                            <Input type="number" value={editProduct?.stock ?? 0} onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value) })} placeholder="Stock" />
                            <Input type="number" value={editProduct?.stockMinimo ?? 0} onChange={(e) => setEditProduct({ ...editProduct, stockMinimo: Number(e.target.value) })} placeholder="Stock mínimo" />
                            <Input type="number" value={editProduct?.precio ?? 0} onChange={(e) => setEditProduct({ ...editProduct, precio: Number(e.target.value) })} placeholder="Precio" />
                            <Input value={editProduct?.unidad || ''} onChange={(e) => setEditProduct({ ...editProduct, unidad: e.target.value })} placeholder="Unidad" />
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="secondary" onClick={handleCloseEdit}>Cancelar</Button>
                            <Button onClick={() => handleSaveEdit(editProduct)}>Guardar</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
                        <p className="text-sm text-cifp-neutral-700 mb-4">¿Eliminar este producto? Esta acción no se puede deshacer.</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setDeleteTarget(null) }}>Cancelar</Button>
                            <Button onClick={confirmDelete} variant="corporate">Eliminar</Button>
                        </div>
                    </div>
                </div>
            )}
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

            {/* Toolbar - Ultra-Compact Mode for Kiosk */}
            <Card className="p-6 flex-shrink-0 short:p-2">
                <div className="space-y-4 short:space-y-1.5">
                    {/* Search and Filters Row - Horizontal on Kiosk */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 short:grid-cols-4 short:gap-1.5">
                        <Input
                            placeholder="Buscar por ID o Nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={Search}
                            className="w-full short:h-8 short:text-xs short:placeholder:text-[10px]"
                        />

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cifp-blue/20 focus:border-cifp-blue short:h-8 short:px-1.5 short:py-0 short:text-xs"
                        >
                            <option value="all">Categorías</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={providerFilter}
                            onChange={(e) => setProviderFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cifp-blue/20 focus:border-cifp-blue short:h-8 short:px-1.5 short:py-0 short:text-xs"
                        >
                            <option value="all">Proveedores</option>
                            {suppliers.map(sup => (
                                <option key={sup} value={sup}>{sup}</option>
                            ))}
                        </select>

                        <Button onClick={handleResetFilters} variant="secondary" className="gap-2 short:h-8 short:text-xs short:px-1.5 short:gap-1">
                            <X className="w-4 h-4 short:w-3 short:h-3" />
                            <span className="short:hidden">Resetear</span>
                        </Button>
                    </div>

                    {/* Action Buttons Row - Single Line on Kiosk */}
                    <div className="flex flex-wrap items-center gap-3 short:gap-1.5 short:flex-nowrap">
                        <Button
                            variant="secondary"
                            disabled={selectedIds.length !== 1}
                            className="gap-2 short:h-8 short:text-[10px] short:px-1.5 short:gap-0.5"
                            title={selectedIds.length !== 1 ? 'Selecciona un único producto para ver detalle' : 'Ver Detalle'}
                            onClick={() => {
                                if (selectedIds.length === 1) {
                                    navigate(`/dashboard/ingredientes/${selectedIds[0]}/full`)
                                }
                            }}
                        >
                            <Eye className="w-4 h-4 short:w-3 short:h-3" />
                            <span className="short:hidden">Ver Detalle</span>
                        </Button>

                        <Button
                            variant="primary"
                            disabled={isRegularUser}
                            className="gap-2 short:h-8 short:text-[10px] short:px-1.5 short:gap-0.5"
                            title={isRegularUser ? 'Solo administradores pueden crear productos' : ''}
                            onClick={() => navigate('/dashboard/ingredientes/new/full')}
                        >
                            <Plus className="w-4 h-4 short:w-3 short:h-3" />
                            <span className="short:hidden">Crear</span>
                        </Button>

                        <Button
                            variant="primary"
                            disabled={isRegularUser || selectedIds.length === 0}
                            className="gap-2 short:h-8 short:text-[10px] short:px-1.5 short:gap-0.5"
                            title={isRegularUser ? 'Solo administradores pueden modificar productos' : 'Selecciona al menos un producto'}
                            onClick={() => {
                                const toEdit = products.find(p => p.id === selectedIds[0])
                                if (toEdit) handleOpenEdit(toEdit)
                            }}
                        >
                            <Edit className="w-4 h-4 short:w-3 short:h-3" />
                            <span className="short:hidden">Modificar</span>
                        </Button>

                        <div className="ml-auto flex items-center gap-2 short:gap-1 short:ml-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none short:gap-1">
                                <input
                                    type="checkbox"
                                    checked={showOnlyLowStock}
                                    onChange={(e) => setShowOnlyLowStock(e.target.checked)}
                                    className="w-4 h-4 text-cifp-red focus:ring-cifp-red border-gray-300 rounded short:w-3 short:h-3"
                                />
                                <span className="text-sm font-medium text-cifp-neutral-700 short:text-[10px] short:whitespace-nowrap">Stock crítico</span>
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
                                        onDoubleClick={() => navigate(`/dashboard/ingredientes/${product.id}/full`)}
                                        className={`transition-colors cursor-pointer ${isLowStock
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
                                                <button onClick={() => handleOpenEdit(product)} className="p-1 text-cifp-blue hover:bg-cifp-blue/10 rounded transition-colors" title="Editar">
                                                    <Edit className="w-4 h-4 short:w-3 short:h-3" />
                                                </button>
                                                <button
                                                    className="p-1 text-cifp-red hover:bg-cifp-red/10 rounded transition-colors"
                                                    disabled={isRegularUser}
                                                    title={isRegularUser ? 'Solo administradores pueden eliminar' : 'Eliminar'}
                                                    onClick={() => handleDelete(product.id)}
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
