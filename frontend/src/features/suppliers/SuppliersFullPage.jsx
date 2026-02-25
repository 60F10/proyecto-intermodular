import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Search, ArrowUpDown, ArrowUp, ArrowDown, X, Plus,
    Edit, Trash2, Download, Truck, CheckCircle, XCircle, ArrowLeft,
} from 'lucide-react'
import { Card, Button, Input } from '../../components/ui'
import { useAuth } from '../../contexts/AuthProvider'
import apiFetch from '../../services/api'

const EMPTY_SUPPLIER = {
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'España',
    cif: '',
    categorias_suministro: '',
    notas: '',
    activo: true,
}

export default function SuppliersFullPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [cityFilter, setCityFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')
    const [selectedIds, setSelectedIds] = useState([])

    const [isEditing, setIsEditing] = useState(false)
    const [editSupplier, setEditSupplier] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [formError, setFormError] = useState(null)

    const isAdmin = user?.role !== 'USER'

    // Load suppliers from API
    useEffect(() => {
        let mounted = true
        setLoading(true)
        apiFetch('/suppliers?limit=500')
            .then(res => {
                const items = res?.data || res
                if (mounted && Array.isArray(items)) setSuppliers(items)
            })
            .catch(() => setSuppliers([]))
            .finally(() => { if (mounted) setLoading(false) })
        return () => { mounted = false }
    }, [])

    // Derived filter options
    const cities = useMemo(() =>
        [...new Set(suppliers.map(s => s.ciudad || ''))].filter(Boolean).sort(), [suppliers])

    const categories = useMemo(() => {
        const all = suppliers.flatMap(s =>
            (s.categorias_suministro || '').split(',').map(c => c.trim()).filter(Boolean)
        )
        return [...new Set(all)].sort()
    }, [suppliers])

    // Filter & sort
    const filtered = useMemo(() => {
        let result = suppliers

        if (search) {
            const q = search.toLowerCase()
            result = result.filter(s =>
                [s.nombre, s.contacto, s.email, s.ciudad, s.cif].some(v => String(v || '').toLowerCase().includes(q))
            )
        }
        if (cityFilter !== 'all') result = result.filter(s => s.ciudad === cityFilter)
        if (categoryFilter !== 'all') result = result.filter(s =>
            (s.categorias_suministro || '').toLowerCase().includes(categoryFilter.toLowerCase())
        )
        if (statusFilter === 'active') result = result.filter(s => s.activo)
        if (statusFilter === 'inactive') result = result.filter(s => !s.activo)

        if (sortColumn) {
            result = [...result].sort((a, b) => {
                let aVal = String(a[sortColumn] ?? '').toLowerCase()
                let bVal = String(b[sortColumn] ?? '').toLowerCase()
                return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
            })
        }

        return result
    }, [suppliers, search, cityFilter, categoryFilter, statusFilter, sortColumn, sortDirection])

    const handleSort = (col) => {
        if (sortColumn === col) setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortColumn(col); setSortDirection('asc') }
    }

    const handleResetFilters = () => {
        setSearch('')
        setCityFilter('all')
        setCategoryFilter('all')
        setStatusFilter('all')
        setSortColumn(null)
        setSortDirection('asc')
    }

    const handleSelectAll = (e) => setSelectedIds(e.target.checked ? filtered.map(s => s.id) : [])
    const handleSelectOne = (id) =>
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

    const handleOpenCreate = () => { setEditSupplier({ ...EMPTY_SUPPLIER }); setFormError(null); setIsEditing(true) }
    const handleOpenEdit = (s) => { setEditSupplier({ ...s }); setFormError(null); setIsEditing(true) }
    const handleCloseEdit = () => { setEditSupplier(null); setIsEditing(false); setFormError(null) }

    const handleSaveEdit = async () => {
        if (!editSupplier) return
        setFormError(null)
        try {
            const isExisting = editSupplier.id
            if (isExisting) {
                const res = await apiFetch(`/suppliers/${editSupplier.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(editSupplier),
                })
                setSuppliers(prev => prev.map(s => s.id === res.id ? res : s))
            } else {
                const res = await apiFetch('/suppliers', {
                    method: 'POST',
                    body: JSON.stringify(editSupplier),
                })
                setSuppliers(prev => [res, ...prev])
            }
            handleCloseEdit()
        } catch (err) {
            setFormError(err?.body?.message || err.message || 'Error al guardar.')
        }
    }

    const handleDelete = (id) => { if (!isAdmin) return; setDeleteTarget(id); setShowDeleteModal(true) }
    const confirmDelete = async () => {
        if (!deleteTarget) return
        try {
            await apiFetch(`/suppliers/${deleteTarget}`, { method: 'DELETE' })
            setSuppliers(prev => prev.filter(s => s.id !== deleteTarget))
            setSelectedIds(prev => prev.filter(x => x !== deleteTarget))
        } catch (err) {
            alert(`Error: ${err?.body?.message || err.message}`)
        } finally {
            setShowDeleteModal(false)
            setDeleteTarget(null)
        }
    }

    const handleExportCSV = () => {
        const data = selectedIds.length > 0
            ? filtered.filter(s => selectedIds.includes(s.id))
            : filtered
        if (!data.length) return
        const keys = ['nombre', 'contacto', 'email', 'telefono', 'ciudad', 'pais', 'cif', 'categorias_suministro', 'activo']
        const csv = [keys.join(','), ...data.map(s =>
            keys.map(k => `"${String(s[k] ?? '').replace(/"/g, '""')}"`).join(',')
        )].join('\n')
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
        const a = document.createElement('a'); a.href = url
        a.download = `proveedores_${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(a); a.click()
        document.body.removeChild(a); URL.revokeObjectURL(url)
    }

    const SortIcon = ({ column }) => {
        if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4 opacity-50" />
        return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
    }

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] space-y-4 pb-4">

            {/* ── Edit / Create Modal ── */}
            {isEditing && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
                        <h3 className="text-lg font-semibold mb-4">
                            {editSupplier?.id ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                                <Input value={editSupplier?.nombre || ''} onChange={e => setEditSupplier({ ...editSupplier, nombre: e.target.value })} placeholder="Distribuciones García S.L." />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Persona de contacto</label>
                                <Input value={editSupplier?.contacto || ''} onChange={e => setEditSupplier({ ...editSupplier, contacto: e.target.value })} placeholder="Carlos García" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                <Input type="email" value={editSupplier?.email || ''} onChange={e => setEditSupplier({ ...editSupplier, email: e.target.value })} placeholder="contacto@empresa.es" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                                <Input value={editSupplier?.telefono || ''} onChange={e => setEditSupplier({ ...editSupplier, telefono: e.target.value })} placeholder="+34 600 000 000" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">CIF / NIF</label>
                                <Input value={editSupplier?.cif || ''} onChange={e => setEditSupplier({ ...editSupplier, cif: e.target.value })} placeholder="B12345678" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Ciudad</label>
                                <Input value={editSupplier?.ciudad || ''} onChange={e => setEditSupplier({ ...editSupplier, ciudad: e.target.value })} placeholder="Madrid" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">País</label>
                                <Input value={editSupplier?.pais || 'España'} onChange={e => setEditSupplier({ ...editSupplier, pais: e.target.value })} placeholder="España" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Dirección</label>
                                <Input value={editSupplier?.direccion || ''} onChange={e => setEditSupplier({ ...editSupplier, direccion: e.target.value })} placeholder="Calle Mayor 12, 2ºA" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Categorías de suministro (separadas por coma)</label>
                                <Input value={editSupplier?.categorias_suministro || ''} onChange={e => setEditSupplier({ ...editSupplier, categorias_suministro: e.target.value })} placeholder="Lácteos,Carnes,Verduras" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Notas internas</label>
                                <textarea
                                    value={editSupplier?.notas || ''}
                                    onChange={e => setEditSupplier({ ...editSupplier, notas: e.target.value })}
                                    placeholder="Observaciones..."
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cifp-blue/20 resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    id="activo-check"
                                    type="checkbox"
                                    checked={!!editSupplier?.activo}
                                    onChange={e => setEditSupplier({ ...editSupplier, activo: e.target.checked })}
                                    className="w-4 h-4 rounded text-cifp-blue"
                                />
                                <label htmlFor="activo-check" className="text-sm font-medium text-gray-700">Activo</label>
                            </div>
                        </div>
                        {formError && (
                            <p className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{formError}</p>
                        )}
                        <div className="mt-5 flex justify-end gap-2">
                            <Button variant="secondary" onClick={handleCloseEdit}>Cancelar</Button>
                            <Button onClick={handleSaveEdit}>Guardar</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation Modal ── */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
                        <p className="text-sm text-cifp-neutral-700 mb-4">
                            ¿Desactivar este proveedor? Puedes reactivarlo editándolo.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setDeleteTarget(null) }}>Cancelar</Button>
                            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Desactivar</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between flex-shrink-0 short:py-0">
                <button
                    onClick={() => navigate('/providers')}
                    className="flex items-center gap-2 text-cifp-blue hover:text-cifp-blue-dark transition-colors short:text-sm"
                >
                    <ArrowLeft className="w-5 h-5 short:w-4 short:h-4" />
                    <span className="font-medium">Volver a Proveedores</span>
                </button>

                <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-indigo-600" />
                    <h1 className="text-xl font-bold text-cifp-neutral-900 short:text-base">Gestión de Proveedores</h1>
                </div>

                <span className="text-sm text-gray-500">{suppliers.length} en total</span>
            </div>

            {/* ── Toolbar ── */}
            <Card className="p-4 flex-shrink-0">
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Input
                            placeholder="Buscar nombre, email, ciudad..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            icon={Search}
                        />
                        <select
                            value={cityFilter}
                            onChange={e => setCityFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cifp-blue/20"
                        >
                            <option value="all">Todas las ciudades</option>
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cifp-blue/20"
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cifp-blue/20"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {isAdmin && (
                            <Button className="gap-2" onClick={handleOpenCreate}>
                                <Plus className="w-4 h-4" /> Nuevo Proveedor
                            </Button>
                        )}
                        {isAdmin && selectedIds.length === 1 && (
                            <Button className="gap-2" onClick={() => handleOpenEdit(suppliers.find(s => s.id === selectedIds[0]))}>
                                <Edit className="w-4 h-4" /> Editar Seleccionado
                            </Button>
                        )}
                        {isAdmin && selectedIds.length > 1 && (
                            <span className="text-xs text-gray-400">Selecciona 1 para editar</span>
                        )}
                        <Button variant="secondary" className="gap-2" onClick={handleResetFilters}>
                            <X className="w-4 h-4" /> Resetear Filtros
                        </Button>
                        <Button variant="secondary" className="gap-2 ml-auto" onClick={handleExportCSV}>
                            <Download className="w-4 h-4" /> Exportar CSV
                        </Button>
                    </div>
                </div>
            </Card>

            {/* ── Data Grid ── */}
            <Card className="flex-grow flex flex-col overflow-hidden min-h-0">
                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400">Cargando proveedores...</div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2 text-gray-400">
                            <Truck className="w-8 h-8" />
                            <p className="text-sm">No se encontraron proveedores</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-cifp-neutral-100 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-3 text-left bg-cifp-neutral-100 w-8">
                                        <input
                                            type="checkbox"
                                            checked={filtered.length > 0 && selectedIds.length === filtered.length}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 rounded text-cifp-blue"
                                        />
                                    </th>
                                    {[
                                        { key: 'nombre', label: 'Nombre' },
                                        { key: 'contacto', label: 'Contacto' },
                                        { key: 'email', label: 'Email' },
                                        { key: 'telefono', label: 'Teléfono' },
                                        { key: 'ciudad', label: 'Ciudad' },
                                        { key: 'categorias_suministro', label: 'Categorías' },
                                        { key: 'activo', label: 'Estado' },
                                    ].map(col => (
                                        <th
                                            key={col.key}
                                            onClick={() => handleSort(col.key)}
                                            className="px-4 py-3 text-left text-xs font-semibold text-cifp-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-cifp-neutral-200 transition-colors bg-cifp-neutral-100"
                                        >
                                            <div className="flex items-center gap-2">
                                                {col.label}
                                                <SortIcon column={col.key} />
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-cifp-neutral-700 uppercase tracking-wider bg-cifp-neutral-100">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-cifp-neutral-200">
                                {filtered.map(s => {
                                    const isSelected = selectedIds.includes(s.id)
                                    return (
                                        <tr
                                            key={s.id}
                                            onDoubleClick={() => isAdmin ? handleOpenEdit(s) : navigate(`/providers/${s.id}`)}
                                            className={`transition-colors cursor-pointer ${!s.activo
                                                ? 'opacity-50 bg-gray-50 hover:bg-gray-100'
                                                : isSelected ? 'bg-cifp-blue/5 hover:bg-cifp-blue/10' : 'hover:bg-cifp-neutral-50'
                                            }`}
                                        >
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectOne(s.id)}
                                                    className="w-4 h-4 rounded text-cifp-blue"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-cifp-neutral-900 whitespace-nowrap">
                                                {s.nombre}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-cifp-neutral-700 whitespace-nowrap">
                                                {s.contacto || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-cifp-neutral-700 whitespace-nowrap">
                                                {s.email ? (
                                                    <a href={`mailto:${s.email}`} className="text-cifp-blue hover:underline">{s.email}</a>
                                                ) : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-cifp-neutral-700 whitespace-nowrap">
                                                {s.telefono || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-cifp-neutral-700 whitespace-nowrap">
                                                {s.ciudad ? `${s.ciudad}${s.pais && s.pais !== 'España' ? `, ${s.pais}` : ''}` : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-cifp-neutral-600 max-w-[200px]">
                                                {s.categorias_suministro ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {s.categorias_suministro.split(',').slice(0, 3).map(c => (
                                                            <span key={c} className="inline-block bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                                                                {c.trim()}
                                                            </span>
                                                        ))}
                                                        {s.categorias_suministro.split(',').length > 3 && (
                                                            <span className="text-xs text-gray-400">+{s.categorias_suministro.split(',').length - 3}</span>
                                                        )}
                                                    </div>
                                                ) : '—'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {s.activo
                                                    ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                                    : <XCircle className="w-5 h-5 text-gray-400 mx-auto" />}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => handleOpenEdit(s)}
                                                            className="p-1 text-cifp-blue hover:bg-cifp-blue/10 rounded transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => handleDelete(s.id)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                            title="Desactivar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {!isAdmin && (
                                                        <button
                                                            onClick={() => navigate(`/providers/${s.id}`)}
                                                            className="p-1 text-cifp-blue hover:bg-cifp-blue/10 rounded transition-colors"
                                                            title="Ver detalle"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                {/* Footer */}
                <div className="px-6 py-3 bg-cifp-neutral-50 flex-shrink-0 flex items-center justify-between gap-4 border-t border-cifp-neutral-200">
                    <p className="text-sm text-cifp-neutral-600">
                        <span className="font-semibold">{filtered.length}</span> proveedor{filtered.length !== 1 ? 'es' : ''}
                        {selectedIds.length > 0 && (
                            <> | <span className="font-semibold text-cifp-blue">{selectedIds.length}</span> seleccionado{selectedIds.length !== 1 ? 's' : ''}</>
                        )}
                    </p>
                </div>
            </Card>
        </div>
    )
}
