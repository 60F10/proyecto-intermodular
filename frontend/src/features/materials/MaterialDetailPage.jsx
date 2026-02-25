import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
    ArrowLeft, ClipboardList, Edit, Save, X, Plus,
    Package, AlertTriangle, CheckCircle
} from 'lucide-react'
import { Card, Button, Input } from '../../components/ui'
import { useAuth } from '../../contexts/AuthProvider'
import { mockProducts, FOOD_CATEGORIES } from '../../services/products.mock'
import apiFetch from '../../services/api'

// Helper: returns true for non-food (material) products
const isMaterial = (p) => !FOOD_CATEGORIES.includes(p.categoria)

// Non-food categories for the category dropdown
const MATERIAL_CATEGORIES = [
    'Utensilios', 'Packaging', 'Limpieza', 'Seguridad',
    'Mobiliario', 'Maquinaria', 'Papelería', 'Otros'
]

const EMPTY_MATERIAL = {
    nombre: '',
    descripcion: '',
    sku: '',
    precio: 0,
    stock: 0,
    stockMinimo: 0,
    categoria: 'Utensilios',
    proveedor: '',
    rendimiento: 1.0,
    unidad: 'unidad',
    activo: true,
}

export default function MaterialDetailPage() {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const isCreate = !id || id === 'new'
    const isEditMode = isCreate || searchParams.get('edit') === '1'

    const isAdmin = user?.role !== 'USER'

    const [material, setMaterial] = useState(null)
    const [form, setForm] = useState(EMPTY_MATERIAL)
    const [loading, setLoading] = useState(!isCreate)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)

    // Load material data on mount (for view/edit modes)
    useEffect(() => {
        if (isCreate) {
            setMaterial(EMPTY_MATERIAL)
            setForm(EMPTY_MATERIAL)
            setLoading(false)
            return
        }

        // Try to find in mock first (instant)
        const found = mockProducts.find(p => p.id === id && isMaterial(p))
        if (found) {
            setMaterial(found)
            setForm({ ...found })
            setLoading(false)
            return
        }

        // Fallback: try API
        setLoading(true)
        apiFetch(`/products/${id}`)
            .then(data => {
                setMaterial(data)
                setForm({ ...data })
            })
            .catch(() => {
                setError('Material no encontrado.')
            })
            .finally(() => setLoading(false))
    }, [id, isCreate])

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!isAdmin) return
        setSaving(true)
        setError(null)
        try {
            if (isCreate) {
                await apiFetch('/products', {
                    method: 'POST',
                    body: JSON.stringify(form),
                })
                setSuccessMsg('Material creado correctamente.')
                setTimeout(() => navigate('/inventory'), 1200)
            } else {
                await apiFetch(`/products/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(form),
                })
                setSuccessMsg('Material guardado correctamente.')
                setTimeout(() => navigate(`/inventory/${id}`), 1200)
            }
        } catch (err) {
            setError(err?.body?.message || err.message || 'Error al guardar.')
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = () => {
        navigate(`/inventory/${id}?edit=1`)
    }

    const handleBack = () => {
        if (isCreate) {
            navigate('/inventory')
        } else if (isEditMode) {
            navigate(`/inventory/${id}`)
        } else {
            navigate('/inventory')
        }
    }

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-cifp-neutral-500 text-sm animate-pulse">Cargando material…</div>
            </div>
        )
    }

    // ── Not found ──────────────────────────────────────────────────────────────
    if (!isCreate && !material && !loading) {
        return (
            <div className="space-y-4 short:space-y-2">
                <button
                    onClick={() => navigate('/inventory')}
                    className="flex items-center gap-2 text-cifp-blue hover:text-cifp-blue-dark transition-colors short:text-sm"
                >
                    <ArrowLeft className="w-5 h-5 short:w-4 short:h-4" />
                    <span className="font-medium">Volver a Materiales</span>
                </button>
                <Card className="p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-cifp-red mx-auto mb-3" />
                    <p className="text-cifp-neutral-700">{error || 'Material no encontrado.'}</p>
                    <Button className="mt-4" onClick={() => navigate('/inventory')}>Volver al listado</Button>
                </Card>
            </div>
        )
    }

    const isLowStock = form.stock < form.stockMinimo

    // ── Page mode label ────────────────────────────────────────────────────────
    const pageTitle = isCreate
        ? 'Nuevo Material'
        : isEditMode
            ? `Editar: ${material?.nombre ?? ''}`
            : material?.nombre ?? 'Detalle de Material'

    return (
        <div className="flex flex-col space-y-4 short:space-y-2 pb-4 short:pb-2">

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-shrink-0 short:py-0">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-cifp-blue hover:text-cifp-blue-dark transition-colors short:text-sm"
                >
                    <ArrowLeft className="w-5 h-5 short:w-4 short:h-4" />
                    <span className="font-medium">
                        {isCreate ? 'Volver a Materiales' : isEditMode ? 'Cancelar edición' : 'Volver a Materiales'}
                    </span>
                </button>

                <div className="flex items-center gap-3 short:gap-2">
                    <ClipboardList className="w-6 h-6 text-green-600 short:w-5 short:h-5" />
                    <h1 className="text-2xl font-bold text-cifp-neutral-900 short:text-lg truncate max-w-xs">
                        {pageTitle}
                    </h1>
                </div>

                {/* Admin action buttons */}
                <div className="flex items-center gap-2 short:gap-1">
                    {!isCreate && !isEditMode && isAdmin && (
                        <Button
                            variant="primary"
                            onClick={handleEdit}
                            className="gap-2 short:h-8 short:text-xs short:px-2"
                        >
                            <Edit className="w-4 h-4 short:hidden" />
                            Editar
                        </Button>
                    )}

                    {isEditMode && isAdmin && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={handleBack}
                                className="gap-2 short:h-8 short:text-xs short:px-2"
                            >
                                <X className="w-4 h-4 short:hidden" />
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={saving}
                                className="gap-2 short:h-8 short:text-xs short:px-2"
                            >
                                {isCreate
                                    ? <><Plus className="w-4 h-4 short:hidden" />Crear</>
                                    : <><Save className="w-4 h-4 short:hidden" />Guardar</>
                                }
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* ── Alerts ──────────────────────────────────────────────────── */}
            {error && (
                <div className="flex items-center gap-2 bg-cifp-red/10 text-cifp-red px-4 py-2 rounded-lg text-sm short:text-xs">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm short:text-xs">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {successMsg}
                </div>
            )}

            {!isAdmin && isEditMode && (
                <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-sm short:text-xs">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    Solo los administradores pueden modificar materiales.
                </div>
            )}

            {/* ── Form Card ───────────────────────────────────────────────── */}
            <Card className="p-6 short:p-3">
                {/* Stock warning banner */}
                {!isCreate && isLowStock && (
                    <div className="flex items-center gap-2 mb-4 bg-cifp-red-light/10 text-cifp-red px-4 py-2 rounded-lg text-sm short:text-xs short:mb-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold">Stock crítico:</span>
                        <span>{form.stock} {form.unidad} (mínimo: {form.stockMinimo})</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 short:gap-2">

                    {/* Nombre */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-cifp-neutral-700 mb-1 uppercase tracking-wider short:text-[10px]">
                            Nombre del Material
                        </label>
                        <Input
                            value={form.nombre}
                            onChange={e => handleChange('nombre', e.target.value)}
                            placeholder="Ej: Cuchillo Chef 20cm"
                            disabled={!isEditMode || !isAdmin}
                            className="short:h-8 short:text-xs"
                        />
                    </div>

                    {/* SKU */}
                    <div>
                        <label className="block text-xs font-semibold text-cifp-neutral-700 mb-1 uppercase tracking-wider short:text-[10px]">
                            SKU
                        </label>
                        <Input
                            value={form.sku}
                            onChange={e => handleChange('sku', e.target.value)}
                            placeholder="MAT_0001"
                            disabled={!isEditMode || !isAdmin}
                            className="font-mono short:h-8 short:text-xs"
                        />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-xs font-semibold text-cifp-neutral-700 mb-1 uppercase tracking-wider short:text-[10px]">
                            Categoría
                        </label>
                        {isEditMode && isAdmin ? (
                            <select
                                value={form.categoria}
                                onChange={e => handleChange('categoria', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cifp-blue/20 focus:border-cifp-blue text-sm short:h-8 short:px-2 short:py-1 short:text-xs"
                            >
                                {MATERIAL_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        ) : (
                            <Input
                                value={form.categoria}
                                disabled
                                className="short:h-8 short:text-xs"
                            />
                        )}
                    </div>

                    {/* Proveedor */}
                    <div>
                        <label className="block text-xs font-semibold text-cifp-neutral-700 mb-1 uppercase tracking-wider short:text-[10px]">
                            Proveedor
                        </label>
                        <Input
                            value={form.proveedor}
                            onChange={e => handleChange('proveedor', e.target.value)}
                            placeholder="Nombre del proveedor"
                            disabled={!isEditMode || !isAdmin}
                            className="short:h-8 short:text-xs"
                        />
                    </div>

                    {/* Unidad */}
                    <div>
                        <label className="block text-xs font-semibold text-cifp-neutral-700 mb-1 uppercase tracking-wider short:text-[10px]">
                            Unidad de Medida
                        </label>
                        <Input
                            value={form.unidad}
                            onChange={e => handleChange('unidad', e.target.value)}
                            placeholder="unidad, kg, L, caja…"
                            disabled={!isEditMode || !isAdmin}
                            className="short:h-8 short:text-xs"
                        />
                    </div>

                    {/* Precio */}
                    <div>
                        <label className="block text-xs font-semibold text-cifp-neutral-700 mb-1 uppercase tracking-wider short:text-[10px]">
                            Precio (€)
                        </label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.precio}
                            onChange={e => handleChange('precio', parseFloat(e.target.value) || 0)}
                            disabled={!isEditMode || !isAdmin}
                            className="short:h-8 short:text-xs"
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <label className={`block text-xs font-semibold mb-1 uppercase tracking-wider short:text-[10px] ${isLowStock ? 'text-cifp-red' : 'text-cifp-neutral-700'}`}>
                            Stock Actual
                        </label>
                        <Input
                            type="number"
                            min="0"
                            value={form.stock}
                            onChange={e => handleChange('stock', parseInt(e.target.value, 10) || 0)}
                            disabled={!isEditMode || !isAdmin}
                            className={`short:h-8 short:text-xs ${isLowStock ? 'border-cifp-red focus:border-cifp-red' : ''}`}
                        />
                    </div>

                    {/* Stock Mínimo */}
                    <div>
                        <label className="block text-xs font-semibold text-cifp-neutral-700 mb-1 uppercase tracking-wider short:text-[10px]">
                            Stock Mínimo
                        </label>
                        <Input
                            type="number"
                            min="0"
                            value={form.stockMinimo}
                            onChange={e => handleChange('stockMinimo', parseInt(e.target.value, 10) || 0)}
                            disabled={!isEditMode || !isAdmin}
                            className="short:h-8 short:text-xs"
                        />
                    </div>

                    {/* Rendimiento */}
                    <div>
                        <label className="block text-xs font-semibold text-cifp-neutral-700 mb-1 uppercase tracking-wider short:text-[10px]">
                            Rendimiento
                        </label>
                        <Input
                            type="number"
                            min="0"
                            step="0.001"
                            value={form.rendimiento}
                            onChange={e => handleChange('rendimiento', parseFloat(e.target.value) || 0)}
                            disabled={!isEditMode || !isAdmin}
                            className="short:h-8 short:text-xs"
                        />
                    </div>

                    {/* Activo */}
                    <div className="flex items-center gap-3 short:gap-2 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.activo}
                                onChange={e => handleChange('activo', e.target.checked)}
                                disabled={!isEditMode || !isAdmin}
                                className="w-4 h-4 text-cifp-blue focus:ring-cifp-blue border-gray-300 rounded short:w-3 short:h-3"
                            />
                            <span className="text-sm font-medium text-cifp-neutral-700 short:text-xs">Material activo</span>
                        </label>
                    </div>

                    {/* Descripción — full width */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-cifp-neutral-700 mb-1 uppercase tracking-wider short:text-[10px]">
                            Descripción
                        </label>
                        <textarea
                            value={form.descripcion}
                            onChange={e => handleChange('descripcion', e.target.value)}
                            placeholder="Descripción del material…"
                            disabled={!isEditMode || !isAdmin}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cifp-blue/20 focus:border-cifp-blue resize-none disabled:bg-cifp-neutral-50 disabled:text-cifp-neutral-600 short:rows-2 short:text-xs short:py-1"
                        />
                    </div>
                </div>
            </Card>

            {/* ── Info footer (view mode only) ─────────────────────────── */}
            {!isCreate && !isEditMode && (
                <div className="flex items-center gap-2 text-cifp-neutral-500 text-xs short:text-[10px] px-1">
                    <Package className="w-3 h-3 flex-shrink-0" />
                    <span>
                        ID: <code className="font-mono">{id}</code>
                        {!isAdmin && ' · Vista de solo lectura'}
                    </span>
                </div>
            )}
        </div>
    )
}
