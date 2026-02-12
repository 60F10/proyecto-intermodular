import { Link, useLocation } from 'react-router-dom'
import { X, Users, Box, ClipboardList, Truck, Heart, Repeat, Home } from 'lucide-react'
import { useEffect } from 'react'

const navigationItems = [
    { to: '/products', label: 'Ingredientes', icon: Box, bg: 'bg-yellow-50', color: 'text-yellow-600' },
    { to: '/inventory', label: 'Materiales', icon: ClipboardList, bg: 'bg-green-50', color: 'text-green-600' },
    { to: '/users', label: 'Usuarios', icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
    { to: '/orders', label: 'Pedidos', icon: Truck, bg: 'bg-blue-50', color: 'text-blue-600' },
    { to: '/delivery-notes', label: 'Albaranes', icon: Repeat, bg: 'bg-red-50', color: 'text-red-600' },
    { to: '/providers', label: 'Proveedores', icon: Heart, bg: 'bg-indigo-50', color: 'text-indigo-600' },
]

/**
 * Get contextual navigation items based on current route
 * If user is in a module, replace that module's button with "Menú Principal" → /dashboard
 */
function getContextualItems(currentPath) {
    return navigationItems.map(item => {
        // Check if current path starts with the item's route (handles /products, /products/full, etc.)
        const isCurrentModule = currentPath.startsWith(item.to)

        if (isCurrentModule) {
            // Transform this button into "Home" button
            return {
                to: '/dashboard',
                label: 'Menú Principal',
                icon: Home,
                bg: 'bg-cifp-blue/10',
                color: 'text-cifp-blue'
            }
        }

        return item
    })
}

export default function MobileMenu({ isOpen, onClose }) {
    const location = useLocation()
    const contextualItems = getContextualItems(location.pathname)

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className="fixed inset-y-0 left-0 w-80 max-w-full bg-white dark:bg-cifp-neutral-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-cifp-neutral-200 dark:border-cifp-neutral-700">
                    <h2 id="mobile-menu-title" className="text-lg font-semibold text-cifp-neutral-900 dark:text-white">
                        Navegación
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-cifp-neutral-100 dark:hover:bg-cifp-neutral-700 transition-colors"
                        aria-label="Cerrar menú"
                    >
                        <X className="w-5 h-5 text-cifp-neutral-600 dark:text-cifp-neutral-300" />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="p-4 space-y-2 overflow-y-auto h-full pb-20">
                    {contextualItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={`${item.to}-${index}`}
                                to={item.to}
                                onClick={onClose}
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-cifp-neutral-50 dark:hover:bg-cifp-neutral-700 transition-colors group"
                            >
                                <div className={`p-3 rounded-lg ${item.bg}`}>
                                    <Icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <span className="text-base font-medium text-cifp-neutral-700 dark:text-cifp-neutral-200 group-hover:text-cifp-neutral-900 dark:group-hover:text-white">
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </>
    )
}
