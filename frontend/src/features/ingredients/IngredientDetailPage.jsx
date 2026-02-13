import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthProvider'
import { mockProducts, getCategories, getSuppliers } from '../../services/products.mock'

export default function IngredientDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    // Role logic: 'USER' (Alumno) -> ReadOnly, 'ADMIN'/'SUPERADMIN' -> Editable
    const isEditable = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN'

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        unidad: 'kg',
        precio: 0,
        stock: 0,
        rendimiento: 80, // Mock default based on requirements
        categoria: '',
        proveedor: ''
    })

    // Categories and Suppliers for Selects
    const categories = getCategories()
    const suppliers = getSuppliers()
    const units = ['kg', 'unidad', 'L'] // Hardcoded common units from mock analysis

    useEffect(() => {
        if (id && id !== 'new') {
            const product = mockProducts.find(p => p.id === id)
            if (product) {
                setFormData({
                    nombre: product.nombre,
                    descripcion: product.descripcion,
                    unidad: product.unidad,
                    precio: product.precio,
                    stock: product.stock,
                    rendimiento: product.rendimiento || 80, // Fallback if missing
                    categoria: product.categoria,
                    proveedor: product.proveedor
                })
            }
        }
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'precio' || name === 'stock' || name === 'rendimiento' ? Number(value) : value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isEditable) return
        // Mock save
        // alert('Producto guardado (simulación)')
        console.log('Saved data:', formData)
        navigate(-1)
    }

    // Optimize grid for 602x457px "Kiosk" layout
    // Using dense packing and minimal padding
    return (
        <div className="h-full w-full max-w-4xl mx-auto flex flex-col">
            {/* Header with Title */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-gray-800 uppercase truncate">
                    {id === 'new' ? 'Nuevo Ingrediente' : formData.nombre || 'Detalle Ingrediente'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3 flex-grow overflow-hidden">

                {/* Compact Grid Layout for Kiosk */}
                <div className="grid grid-cols-12 gap-x-3 gap-y-2 overflow-y-auto pr-1 custom-scrollbar">

                    {/* Nombre - Full Width */}
                    <div className="col-span-12 sm:col-span-8">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Nombre del producto</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="w-full px-3 py-1.5 text-sm border rounded-lg bg-blue-50/50 border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-75 disabled:cursor-not-allowed font-medium text-gray-800"
                            placeholder="Ej: Zanahoria"
                        />
                    </div>

                    {/* Type/Unit */}
                    <div className="col-span-6 sm:col-span-4">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Tipo Unidad</label>
                        <select
                            name="unidad"
                            value={formData.unidad}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="w-full px-3 py-1.5 text-sm border rounded-lg bg-green-50 border-green-100 focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-75 font-medium text-gray-800"
                        >
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>

                    {/* Description - Spans full width */}
                    <div className="col-span-12">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            disabled={!isEditable}
                            rows={2}
                            className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:opacity-75 disabled:cursor-not-allowed text-gray-700 leading-tight"
                            placeholder="Descripción del ingrediente..."
                        />
                    </div>

                    {/* Row: Precio, Stock, Rendimiento, Relación */}
                    <div className="col-span-6 sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Precio/Unidad</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                name="precio"
                                value={formData.precio}
                                onChange={handleChange}
                                disabled={!isEditable}
                                className="w-full px-3 py-1.5 text-sm border rounded-lg bg-green-50 border-green-100 focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-75 font-medium text-gray-800"
                            />
                            <span className="absolute right-2 top-1.5 text-xs text-gray-400">€</span>
                        </div>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-50 border-gray-200 focus:ring-2 focus:ring-gray-500 outline-none disabled:opacity-75 font-medium text-gray-800"
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">% Rendimiento</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="rendimiento"
                                value={formData.rendimiento}
                                onChange={handleChange}
                                disabled={!isEditable}
                                className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white border-gray-200 focus:ring-2 focus:ring-gray-500 outline-none disabled:opacity-75 font-medium text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Relación</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={(formData.rendimiento / 100).toFixed(2)}
                                disabled
                                className="w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed font-medium"
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div className="col-span-12 sm:col-span-6">
                        <label className="block text-[10px] uppercase font-bold text-white bg-green-600 px-2 rounded-t w-max mb-0">Categoría</label>
                        <select
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="w-full px-3 py-1.5 text-sm border rounded-b-lg rounded-tr-lg border-green-600 focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-75 bg-white font-medium text-gray-800"
                        >
                            <option value="">Selecciona</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Proveedor */}
                    <div className="col-span-12 sm:col-span-6">
                        <label className="block text-[10px] uppercase font-bold text-gray-900 bg-purple-200 px-2 rounded-t w-max mb-0">Proveedor</label>
                        <select
                            name="proveedor"
                            value={formData.proveedor}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="w-full px-3 py-1.5 text-sm border rounded-b-lg rounded-tr-lg border-purple-200 focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-75 bg-white font-medium text-gray-800"
                        >
                            <option value="">Selecciona</option>
                            {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 mt-auto pt-2 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-black text-white py-2.5 rounded-xl font-bold text-xs tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 uppercase shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver atrás
                    </button>

                    {isEditable && (
                        <button
                            type="submit"
                            className="flex-1 bg-black text-white py-2.5 rounded-xl font-bold text-xs tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 uppercase shadow-sm"
                        >
                            <Save className="w-4 h-4" /> Guardar
                        </button>
                    )}
                </div>

            </form>
        </div>
    )
}
