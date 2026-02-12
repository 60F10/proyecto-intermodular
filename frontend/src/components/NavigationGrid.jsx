import { Link } from 'react-router-dom'

/**
 * Reusable Navigation Grid Component
 * Displays a grid of navigation tiles with icons
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of navigation items {to, label, icon, bg, color}
 * @param {string} props.className - Optional additional CSS classes
 */
export default function NavigationGrid({ items, className = '' }) {
    return (
        <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 place-items-center">
                {items.map((it) => {
                    const Icon = it.icon
                    return (
                        <Link
                            key={it.to}
                            to={it.to}
                            className="flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-2xl shadow-sm hover:shadow-md w-full max-w-[220px] transition-shadow"
                        >
                            <div className={`p-3 rounded-lg ${it.bg}`}>
                                <Icon className={`w-10 h-10 ${it.color}`} />
                            </div>
                            <div className="text-lg font-medium text-cifp-neutral-700">{it.label}</div>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
