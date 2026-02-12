/**
 * Mock data for products (ingredients)
 * Based on product.entity.ts from backend
 * 
 * @typedef {Object} Product
 * @property {string} id - UUID
 * @property {string} nombre - Product name
 * @property {string} descripcion - Product description
 * @property {string} sku - Stock Keeping Unit (unique identifier)
 * @property {number} precio - Price in euros
 * @property {number} stock - Current stock quantity
 * @property {number} stockMinimo - Minimum stock threshold for critical alerts
 * @property {string} categoria - Product category
 * @property {string} proveedor - Supplier name
 * @property {number} rendimiento - Performance/yield metric
 * @property {string} unidad - Unit of measure (kg, unidad, L, etc.)
 * @property {boolean} activo - Active status
 */

export const mockProducts = [
    {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        nombre: 'Zanahoria',
        descripcion: 'Zanahoria fresca de temporada',
        sku: 'IN_0001',
        precio: 0.63,
        stock: 87,
        stockMinimo: 100,
        categoria: 'Verduras',
        proveedor: 'Frutas del Sur',
        rendimiento: 4.480,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'c89e9a8b-2e4d-4c7f-9f1e-3b5a7c2d3e4f',
        nombre: 'Wasabi',
        descripcion: 'Wasabi japonés premium',
        sku: 'IN_0035',
        precio: 2.30,
        stock: 108,
        stockMinimo: 50,
        categoria: 'Especias',
        proveedor: 'Sabores de Asia',
        rendimiento: 3.0,
        unidad: 'unidad',
        activo: true
    },
    {
        id: 'a1b2c3d4-5e6f-7890-ab12-cd34ef567890',
        nombre: 'Tomate Cherry',
        descripcion: 'Tomates cherry rojos',
        sku: 'IN_0002',
        precio: 1.85,
        stock: 45,
        stockMinimo: 60,
        categoria: 'Verduras',
        proveedor: 'Huertos del Norte',
        rendimiento: 5.200,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'b2c3d4e5-6f78-9012-bc34-de56789abcde',
        nombre: 'Pechuga de Pollo',
        descripcion: 'Pechuga de pollo sin hueso',
        sku: 'IN_0003',
        precio: 5.99,
        stock: 120,
        stockMinimo: 80,
        categoria: 'Carnes',
        proveedor: 'Carnicería Premium',
        rendimiento: 8.500,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'd4e5f6a7-b8c9-0d1e-2f34-567890abcdef',
        nombre: 'Leche Entera',
        descripcion: 'Leche entera pasteurizada',
        sku: 'IN_0004',
        precio: 0.89,
        stock: 200,
        stockMinimo: 150,
        categoria: 'Lácteos',
        proveedor: 'Lácteos Canarios',
        rendimiento: 10.000,
        unidad: 'L',
        activo: true
    },
    {
        id: 'e5f6a7b8-c9d0-1e2f-3456-7890abcdef12',
        nombre: 'Aceite de Oliva Virgen Extra',
        descripcion: 'Aceite de oliva de primera cosecha',
        sku: 'IN_0005',
        precio: 12.50,
        stock: 35,
        stockMinimo: 40,
        categoria: 'Aceites',
        proveedor: 'Olivares del Sur',
        rendimiento: 2.800,
        unidad: 'L',
        activo: true
    },
    {
        id: 'f6a7b8c9-d0e1-2f34-5678-90abcdef1234',
        nombre: 'Ajo',
        descripcion: 'Ajo blanco nacional',
        sku: 'IN_0006',
        precio: 3.20,
        stock: 15,
        stockMinimo: 30,
        categoria: 'Verduras',
        proveedor: 'Huertos del Norte',
        rendimiento: 1.500,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'a7b8c9d0-e1f2-3456-7890-abcdef123456',
        nombre: 'Harina de Trigo',
        descripcion: 'Harina de trigo tipo 000',
        sku: 'IN_0007',
        precio: 0.75,
        stock: 250,
        stockMinimo: 200,
        categoria: 'Harinas',
        proveedor: 'Molinos La Paloma',
        rendimiento: 15.000,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'b8c9d0e1-f234-5678-90ab-cdef12345678',
        nombre: 'Sal Marina',
        descripcion: 'Sal marina gruesa',
        sku: 'IN_0008',
        precio: 0.45,
        stock: 180,
        stockMinimo: 100,
        categoria: 'Especias',
        proveedor: 'Salinas del Atlántico',
        rendimiento: 20.000,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'c9d0e1f2-3456-7890-abcd-ef1234567890',
        nombre: 'Cebolla Roja',
        descripcion: 'Cebolla roja dulce',
        sku: 'IN_0009',
        precio: 0.95,
        stock: 8,
        stockMinimo: 50,
        categoria: 'Verduras',
        proveedor: 'Frutas del Sur',
        rendimiento: 4.000,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'd0e1f234-5678-90ab-cdef-123456789012',
        nombre: 'Queso Manchego',
        descripcion: 'Queso manchego curado',
        sku: 'IN_0010',
        precio: 18.90,
        stock: 12,
        stockMinimo: 20,
        categoria: 'Lácteos',
        proveedor: 'Quesos Artesanos',
        rendimiento: 1.200,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'e1f23456-7890-abcd-ef12-34567890abcd',
        nombre: 'Pimienta Negra',
        descripcion: 'Pimienta negra en grano',
        sku: 'IN_0011',
        precio: 25.00,
        stock: 5,
        stockMinimo: 10,
        categoria: 'Especias',
        proveedor: 'Sabores de Asia',
        rendimiento: 0.500,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'f2345678-90ab-cdef-1234-567890abcdef',
        nombre: 'Huevos Frescos',
        descripcion: 'Huevos de gallina clase L',
        sku: 'IN_0012',
        precio: 0.25,
        stock: 300,
        stockMinimo: 200,
        categoria: 'Huevos',
        proveedor: 'Granja Los Almendros',
        rendimiento: 30.000,
        unidad: 'unidad',
        activo: true
    },
    {
        id: '23456789-0abc-def1-2345-67890abcdef1',
        nombre: 'Atún en Lata',
        descripcion: 'Atún en aceite de oliva',
        sku: 'IN_0013',
        precio: 1.50,
        stock: 95,
        stockMinimo: 100,
        categoria: 'Conservas',
        proveedor: 'Pescados del Cantábrico',
        rendimiento: 6.500,
        unidad: 'unidad',
        activo: true
    },
    {
        id: '3456789a-bcde-f123-4567-890abcdef123',
        nombre: 'Arroz Bomba',
        descripcion: 'Arroz bomba D.O. Valencia',
        sku: 'IN_0014',
        precio: 2.80,
        stock: 150,
        stockMinimo: 100,
        categoria: 'Cereales',
        proveedor: 'Arroces Levante',
        rendimiento: 12.000,
        unidad: 'kg',
        activo: true
    },
    {
        id: '456789ab-cdef-1234-5678-90abcdef1234',
        nombre: 'Lentejas',
        descripcion: 'Lentejas pardinas',
        sku: 'IN_0015',
        precio: 2.20,
        stock: 80,
        stockMinimo: 50,
        categoria: 'Legumbres',
        proveedor: 'Legumbres Castellanas',
        rendimiento: 8.000,
        unidad: 'kg',
        activo: true
    },
    {
        id: '56789abc-def1-2345-6789-0abcdef12345',
        nombre: 'Mantequilla',
        descripcion: 'Mantequilla sin sal',
        sku: 'IN_0016',
        precio: 4.50,
        stock: 25,
        stockMinimo: 30,
        categoria: 'Lácteos',
        proveedor: 'Lácteos Canarios',
        rendimiento: 2.500,
        unidad: 'kg',
        activo: true
    },
    {
        id: '6789abcd-ef12-3456-7890-abcdef123456',
        nombre: 'Azúcar Blanco',
        descripcion: 'Azúcar refinado',
        sku: 'IN_0017',
        precio: 0.90,
        stock: 220,
        stockMinimo: 150,
        categoria: 'Endulzantes',
        proveedor: 'Azucarera Nacional',
        rendimiento: 18.000,
        unidad: 'kg',
        activo: true
    },
    {
        id: '789abcde-f123-4567-890a-bcdef1234567',
        nombre: 'Café Molido',
        descripcion: 'Café arábica molido',
        sku: 'IN_0018',
        precio: 8.90,
        stock: 40,
        stockMinimo: 35,
        categoria: 'Bebidas',
        proveedor: 'Cafés del Mundo',
        rendimiento: 3.200,
        unidad: 'kg',
        activo: true
    },
    {
        id: '89abcdef-1234-5678-90ab-cdef12345678',
        nombre: 'Chocolate Negro 70%',
        descripcion: 'Chocolate negro para repostería',
        sku: 'IN_0019',
        precio: 6.75,
        stock: 18,
        stockMinimo: 25,
        categoria: 'Repostería',
        proveedor: 'Chocolates Premium',
        rendimiento: 1.800,
        unidad: 'kg',
        activo: true
    },
    {
        id: '9abcdef1-2345-6789-0abc-def123456789',
        nombre: 'Vainilla en Rama',
        descripcion: 'Vainas de vainilla de Madagascar',
        sku: 'IN_0020',
        precio: 85.00,
        stock: 3,
        stockMinimo: 5,
        categoria: 'Especias',
        proveedor: 'Sabores de Asia',
        rendimiento: 0.200,
        unidad: 'unidad',
        activo: true
    },
    {
        id: 'abcdef12-3456-7890-abcd-ef1234567890',
        nombre: 'Pimiento Rojo',
        descripcion: 'Pimiento rojo californiano',
        sku: 'IN_0021',
        precio: 1.40,
        stock: 52,
        stockMinimo: 40,
        categoria: 'Verduras',
        proveedor: 'Huertos del Norte',
        rendimiento: 5.800,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'bcdef123-4567-890a-bcde-f12345678901',
        nombre: 'Salmón Fresco',
        descripcion: 'Salmón atlántico fresco',
        sku: 'IN_0022',
        precio: 16.90,
        stock: 10,
        stockMinimo: 15,
        categoria: 'Pescados',
        proveedor: 'Pescados del Cantábrico',
        rendimiento: 1.500,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'cdef1234-5678-90ab-cdef-123456789012',
        nombre: 'Gambas Congeladas',
        descripcion: 'Gambas blancas congeladas',
        sku: 'IN_0023',
        precio: 12.50,
        stock: 6,
        stockMinimo: 20,
        categoria: 'Mariscos',
        proveedor: 'Mariscos Galicia',
        rendimiento: 1.200,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'def12345-6789-0abc-def1-234567890abc',
        nombre: 'Yogur Natural',
        descripcion: 'Yogur natural sin azúcar',
        sku: 'IN_0024',
        precio: 0.65,
        stock: 140,
        stockMinimo: 100,
        categoria: 'Lácteos',
        proveedor: 'Lácteos Canarios',
        rendimiento: 12.000,
        unidad: 'unidad',
        activo: true
    },
    {
        id: 'ef123456-7890-abcd-ef12-34567890abcd',
        nombre: 'Miel de Abeja',
        descripcion: 'Miel pura de flores',
        sku: 'IN_0025',
        precio: 9.50,
        stock: 22,
        stockMinimo: 20,
        categoria: 'Endulzantes',
        proveedor: 'Apicultores del Valle',
        rendimiento: 1.800,
        unidad: 'kg',
        activo: true
    },
    {
        id: 'f1234567-890a-bcde-f123-4567890abcde',
        nombre: 'Vinagre de Jerez',
        descripcion: 'Vinagre de vino de Jerez',
        sku: 'IN_0026',
        precio: 5.20,
        stock: 48,
        stockMinimo: 30,
        categoria: 'Condimentos',
        proveedor: 'Bodegas del Sur',
        rendimiento: 3.500,
        unidad: 'L',
        activo: true
    },
    {
        id: '1234567a-90ab-cdef-1234-567890abcdef',
        nombre: 'Orégano Seco',
        descripcion: 'Orégano seco mediterráneo',
        sku: 'IN_0027',
        precio: 12.00,
        stock: 7,
        stockMinimo: 15,
        categoria: 'Especias',
        proveedor: 'Hierbas Aromáticas',
        rendimiento: 0.600,
        unidad: 'kg',
        activo: true
    },
    {
        id: '234567ab-cdef-1234-5678-90abcdef1234',
        nombre: 'Champiñones Frescos',
        descripcion: 'Champiñones blancos frescos',
        sku: 'IN_0028',
        precio: 3.80,
        stock: 28,
        stockMinimo: 40,
        categoria: 'Hongos',
        proveedor: 'Setas y Hongos',
        rendimiento: 2.500,
        unidad: 'kg',
        activo: true
    },
    {
        id: '34567abc-def1-2345-6789-0abcdef12345',
        nombre: 'Espárragos Verdes',
        descripcion: 'Espárragos verdes finos',
        sku: 'IN_0029',
        precio: 4.90,
        stock: 14,
        stockMinimo: 25,
        categoria: 'Verduras',
        proveedor: 'Huertos del Norte',
        rendimiento: 2.100,
        unidad: 'kg',
        activo: true
    }
]

/**
 * Get unique categories from products
 * @returns {string[]} Array of unique category names
 */
export function getCategories() {
    return [...new Set(mockProducts.map(p => p.categoria))].sort()
}

/**
 * Get unique suppliers from products
 * @returns {string[]} Array of unique supplier names
 */
export function getSuppliers() {
    return [...new Set(mockProducts.map(p => p.proveedor))].sort()
}

/**
 * Get products with low stock (stock < stockMinimo)
 * @returns {Product[]} Array of products with critical stock levels
 */
export function getLowStockProducts() {
    return mockProducts.filter(p => p.stock < p.stockMinimo)
}
