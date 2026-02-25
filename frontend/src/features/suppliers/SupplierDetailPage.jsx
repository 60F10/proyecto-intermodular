import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
    ArrowLeft, Truck, Edit, Save, X,
    CheckCircle, XCircle, AlertTriangle, Mail, Phone, MapPin, Building2
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

export default function SupplierDetailPage() {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const isCreate = !id || id === 'new'
    const isEditMode = isCreate || searchParams.get('edit') === '1'
    const isAdmin = user?.role !== 'USER'

    const [supplier, setSupplier] = useState(null)
    const [form, setForm] = useState(EMPTY_SUPPLIER)
    const [loading, setLoading] = useState(!isCreate)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)

    // Load supplier on mount
    useEffect(() => {
        if (isCreate) {
            setSupplier(EMPTY_SUPPLIER)
            setForm(EMPTY_SUPPLIER)
            setLoading(false)
            return
        }
        setLoading(true)
        apiFetch(`/suppliers/${id}`)
            .then(data => { setSupplier(data); setForm({ ...data }) })
            .catch(() => setError('Proveedor no encontrado.'))
            .finally(() => setLoading(false))
    }, [id, isCreate])

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

    const handleSave = async () => {
        if (!isAdmin) return
        setSaving(true)
        setError(null)
        try {
            if (isCreate) {
                await apiFetch('/suppliers', { method: 'POST', body: JSON.stringify(form) })
                setSuccessMsg('Proveedor creado correctamente.')
                setTimeout(() => navigate('/providers/full'), 1200)
            } else {
                const updated = await apiFetch(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(form) })
                setSupplier(updated)
                setForm({ ...updated })
                setSuccessMsg('Proveedor guardado correctamente.')
                setTimeout(() => navigate(`/providers/${id}`), 1200)
            }
        } catch (err) {
            setError(err?.body?.message || err.message || 'Error al guardar.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                <span>Cargando proveedor...</span>
            </div>
        )
    }

    if (error && !isCreate) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-red-500">
                <AlertTriangle className="w-10 h-10" />
                <p className="text-sm">{error}</p>
                <Button onClick={() => navigate('/providers')} variant="secondary">Volver</Button>
            </div>
        )
    }

    const displayData = isEditMode ? form : supplier

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-8">

            {/* ── Header ── */}
            <div className="flex items-center justify-between flex-shrink-0 short:py-0">
                <button
                    onClick={() => {
                        if (isCreate) navigate('/providers')
                        else if (isEditMode) navigate(`/providers/${id}`)
                        else navigate('/providers')
                    }}
                    className="flex items-center gap-2 text-cifp-blue hover:text-cifp-blue-dark transition-colors short:text-sm"
                >
                    <ArrowLeft className="w-5 h-5 short:w-4 short:h-4" />
                    <span className="font-medium">
                        {isCreate ? 'Volver a Proveedores' : isEditMode ? 'Cancelar edición' : 'Volver a Proveedores'}
                    </span>
                </button>

                <div className="flex items-center gap-3 short:gap-2">
                    <Truck className="w-6 h-6 text-indigo-600 short:w-5 short:h-5" />
                    <h1 className="text-2xl font-bold text-cifp-neutral-900 short:text-lg truncate max-w-xs">
                        {isCreate ? 'Nuevo Proveedor' : isEditMode ? `Editar: ${displayData?.nombre ?? ''}` : (displayData?.nombre || 'Proveedor')}
                    </h1>
                </div>

                <div className="flex items-center gap-2 short:gap-1">
                    {!isCreate && !isEditMode && displayData?.activo !== undefined && (
                        <span className={`hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            displayData?.activo ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                            {displayData?.activo
                                ? <><CheckCircle className="w-3.5 h-3.5" /> Activo</>
                                : <><XCircle className="w-3.5 h-3.5" /> Inactivo</>}
                        </span>
                    )}
                    {!isCreate && !isEditMode && isAdmin && (
                        <Button
                            onClick={() => navigate(`/providers/${id}?edit=1`)}
                            className="gap-2 short:h-8 short:text-xs short:px-2"
                        >
                            <Edit className="w-4 h-4 short:hidden" /> Editar
                        </Button>
                    )}
                </div>
            </div>

            {/* ── Success / Error notifications ── */}
            {successMsg && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">{successMsg}</span>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* ── Main Info Card ── */}
            <Card className="p-6 space-y-6">
                <h2 className="text-base font-semibold text-cifp-neutral-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-500" /> Información general
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        {isEditMode
                            ? <Input value={form.nombre} onChange={e => handleChange('nombre', e.target.value)} placeholder="Distribuciones García S.L." />
                            : <p className="text-sm text-gray-900 py-2">{displayData?.nombre || '—'}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CIF / NIF</label>
                        {isEditMode
                            ? <Input value={form.cif || ''} onChange={e => handleChange('cif', e.target.value)} placeholder="B12345678" />
                            : <p className="text-sm text-gray-900 py-2">{displayData?.cif || '—'}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        {isEditMode
                            ? (
                                <select
                                    value={form.activo ? 'true' : 'false'}
                                    onChange={e => handleChange('activo', e.target.value === 'true')}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cifp-blue/20"
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            )
                            : (
                                <div className="py-2">
                                    {displayData?.activo
                                        ? <span className="inline-flex items-center gap-1 text-sm text-green-600"><CheckCircle className="w-4 h-4" /> Activo</span>
                                        : <span className="inline-flex items-center gap-1 text-sm text-gray-400"><XCircle className="w-4 h-4" /> Inactivo</span>}
                                </div>
                            )}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categorías de suministro</label>
                        {isEditMode
                            ? <Input value={form.categorias_suministro || ''} onChange={e => handleChange('categorias_suministro', e.target.value)} placeholder="Lácteos,Carnes,Verduras" />
                            : (
                                <div className="flex flex-wrap gap-1 py-2">
                                    {displayData?.categorias_suministro
                                        ? displayData.categorias_suministro.split(',').map(c => (
                                            <span key={c} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{c.trim()}</span>
                                        ))
                                        : <span className="text-sm text-gray-400">—</span>}
                                </div>
                            )}
                    </div>
                </div>
            </Card>

            {/* ── Contact Card ── */}
            <Card className="p-6 space-y-4">
                <h2 className="text-base font-semibold text-cifp-neutral-800 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-500" /> Contacto
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Persona de contacto</label>
                        {isEditMode
                            ? <Input value={form.contacto || ''} onChange={e => handleChange('contacto', e.target.value)} placeholder="Carlos García" />
                            : <p className="text-sm text-gray-900 py-2">{displayData?.contacto || '—'}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        {isEditMode
                            ? <Input type="email" value={form.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="contacto@empresa.es" />
                            : (
                                <p className="text-sm py-2">
                                    {displayData?.email
                                        ? <a href={`mailto:${displayData.email}`} className="text-cifp-blue hover:underline flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{displayData.email}</a>
                                        : '—'}
                                </p>
                            )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        {isEditMode
                            ? <Input value={form.telefono || ''} onChange={e => handleChange('telefono', e.target.value)} placeholder="+34 600 000 000" />
                            : (
                                <p className="text-sm py-2">
                                    {displayData?.telefono
                                        ? <a href={`tel:${displayData.telefono}`} className="text-cifp-blue hover:underline flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{displayData.telefono}</a>
                                        : '—'}
                                </p>
                            )}
                    </div>
                </div>
            </Card>

            {/* ── Address Card ── */}
            <Card className="p-6 space-y-4">
                <h2 className="text-base font-semibold text-cifp-neutral-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-500" /> Dirección
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        {isEditMode
                            ? <Input value={form.direccion || ''} onChange={e => handleChange('direccion', e.target.value)} placeholder="Calle Mayor 12, 2ºA" />
                            : <p className="text-sm text-gray-900 py-2">{displayData?.direccion || '—'}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                        {isEditMode
                            ? <Input value={form.ciudad || ''} onChange={e => handleChange('ciudad', e.target.value)} placeholder="Madrid" />
                            : <p className="text-sm text-gray-900 py-2">{displayData?.ciudad || '—'}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                        {isEditMode
                            ? <Input value={form.pais || 'España'} onChange={e => handleChange('pais', e.target.value)} placeholder="España" />
                            : <p className="text-sm text-gray-900 py-2">{displayData?.pais || '—'}</p>}
                    </div>
                </div>
            </Card>

            {/* ── Notes Card ── */}
            <Card className="p-6 space-y-4">
                <h2 className="text-base font-semibold text-cifp-neutral-800">Notas internas</h2>
                {isEditMode
                    ? (
                        <textarea
                            value={form.notas || ''}
                            onChange={e => handleChange('notas', e.target.value)}
                            placeholder="Observaciones, condiciones de pago, etc."
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cifp-blue/20 resize-none"
                        />
                    )
                    : <p className="text-sm text-gray-700 whitespace-pre-wrap min-h-[3rem]">{displayData?.notas || '—'}</p>}
            </Card>

            {/* ── Action Buttons ── */}
            {isEditMode && isAdmin && (
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        variant="secondary"
                        className="gap-2"
                        onClick={() => isCreate ? navigate('/providers') : navigate(`/providers/${id}`)}
                        disabled={saving}
                    >
                        <X className="w-4 h-4" /> Cancelar
                    </Button>
                    <Button className="gap-2" onClick={handleSave} disabled={saving}>
                        <Save className="w-4 h-4" />
                        {saving ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            )}
        </div>
    )
}
