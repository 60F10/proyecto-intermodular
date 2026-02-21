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
            {/* Header with Title - Compact margin */}
            <div className="flex items-center justify-between mb-1 md:mb-2">
                <h1 className="text-lg md:text-xl font-bold text-gray-800 uppercase truncate">
                    {id === 'new' ? 'Nuevo Ingrediente' : formData.nombre || 'Detalle Ingrediente'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/50 backdrop-blur-sm p-2 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2 md:gap-4 flex-grow overflow-hidden h-full">

                {/* Compact Grid Layout for Kiosk - Reduced gaps */}
                <div className="grid grid-cols-12 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-4 overflow-y-auto pr-1 custom-scrollbar">

                    {/* Nombre - Full Width */}
                    <div className="col-span-12 sm:col-span-8">
                        <label className="block text-[10px] md:text-xs uppercase font-bold text-gray-800 mb-0 md:mb-1">Nombre del producto</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="w-full px-2 py-0 h-8 md:h-10 md:py-2 text-xs md:text-sm border rounded-lg bg-blue-50/50 border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-75 disabled:cursor-not-allowed font-medium text-gray-800"
                            placeholder="Ej: Zanahoria"
                        />
                    </div>

                    {/* Type/Unit */}
                    <div className="col-span-6 sm:col-span-4">
                        <label className="block text-[10px] md:text-xs uppercase font-bold text-gray-800 mb-0 md:mb-1">Tipo Unidad</label>
                        <select
                            name="unidad"
                            value={formData.unidad}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="w-full px-2 py-0 h-8 md:h-10 md:py-2 text-xs md:text-sm border rounded-lg bg-green-50 border-green-100 focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-75 font-medium text-gray-800"
                        >
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>

                    {/* Description - Spans full width */}
                    <div className="col-span-12">
                        <label className="block text-[10px] md:text-xs uppercase font-bold text-gray-800 mb-0 md:mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            disabled={!isEditable}
                            rows={2}
                            className="w-full px-2 py-1 text-xs md:text-sm border rounded-lg bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:opacity-75 disabled:cursor-not-allowed text-gray-700 leading-tight"
                            placeholder="Descripción del ingrediente..."
                        />
                    </div>

                    {/* Row: Precio, Stock, Rendimiento, Relación */}
                    <div className="col-span-6 sm:col-span-3">
                        <label className="block text-[10px] md:text-xs uppercase font-bold text-gray-800 mb-0 md:mb-1">Precio/Unidad</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                name="precio"
                                value={formData.precio}
                                onChange={handleChange}
                                disabled={!isEditable}
                                className="w-full px-2 py-0 h-8 md:h-10 md:py-2 text-xs md:text-sm border rounded-lg bg-green-50 border-green-100 focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-75 font-medium text-gray-800"
                            />
                            <span className="absolute right-2 top-1 md:top-2.5 text-[10px] md:text-xs text-gray-400">€</span>
                        </div>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="block text-[10px] md:text-xs uppercase font-bold text-gray-800 mb-0 md:mb-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="w-full px-2 py-0 h-8 md:h-10 md:py-2 text-xs md:text-sm border rounded-lg bg-gray-50 border-gray-200 focus:ring-2 focus:ring-gray-500 outline-none disabled:opacity-75 font-medium text-gray-800"
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="block text-[10px] md:text-xs uppercase font-bold text-gray-800 mb-0 md:mb-1">% Rendimiento</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="rendimiento"
                                value={formData.rendimiento}
                                onChange={handleChange}
                                disabled={!isEditable}
                                className="w-full px-2 py-0 h-8 md:h-10 md:py-2 text-xs md:text-sm border rounded-lg bg-white border-gray-200 focus:ring-2 focus:ring-gray-500 outline-none disabled:opacity-75 font-medium text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="block text-[10px] md:text-xs uppercase font-bold text-gray-800 mb-0 md:mb-1">Relación</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={(formData.rendimiento / 100).toFixed(2)}
                                disabled
                                className="w-full px-2 py-0 h-8 md:h-10 md:py-2 text-xs md:text-sm border rounded-lg bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed font-medium"
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div className="col-span-12 sm:col-span-6">
                        <label className="block text-[10px] md:text-xs uppercase font-bold text-white bg-green-600 px-2 rounded-t w-max mb-0">Categoría</label>
                        <select
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="w-full px-2 py-0 h-8 md:h-10 md:py-2 text-xs md:text-sm border rounded-b-lg rounded-tr-lg border-green-600 focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-75 bg-white font-medium text-gray-800"
                        >
                            <option value="">Selecciona</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Proveedor */}
                    <div className="col-span-12 sm:col-span-6">
                        <label className="block text-[10px] md:text-xs uppercase font-bold text-gray-900 bg-purple-200 px-2 rounded-t w-max mb-0">Proveedor</label>
                        <select
                            name="proveedor"
                            value={formData.proveedor}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="w-full px-2 py-0 h-8 md:h-10 md:py-2 text-xs md:text-sm border rounded-b-lg rounded-tr-lg border-purple-200 focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-75 bg-white font-medium text-gray-800"
                        >
                            <option value="">Selecciona</option>
                            {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                </div>

                {/* Footer Actions - Compact height and margin */}
                <div className="flex gap-4 mt-auto pt-1 md:pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-black text-white h-8 md:h-10 rounded-xl font-bold text-[10px] md:text-xs tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 uppercase shadow-sm"
                    >
                        <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Volver atrás
                    </button>

                    {isEditable && (
                        <button
                            type="submit"
                            className="flex-1 bg-black text-white h-8 md:h-10 rounded-xl font-bold text-[10px] md:text-xs tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 uppercase shadow-sm"
                        >
                            <Save className="w-3 h-3 md:w-4 md:h-4" /> Guardar
                        </button>
                    )}
                </div>

            </form>
        </div>
    )
}
