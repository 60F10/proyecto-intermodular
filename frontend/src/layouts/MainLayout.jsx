import { Outlet } from 'react-router-dom'

function MainLayout() {
    return (
        <div className="h-screen flex flex-col bg-cifp-neutral-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-1 sm:py-4">
                    <h1 className="text-lg sm:text-2xl font-bold text-cifp-neutral-900">SmartEconomato</h1>
                </div>
            </header>

            {/* Main Content - flex-grow para empujar footer al fondo */}
            <main className="flex-grow max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-8 w-full overflow-y-auto">
                <Outlet />
            </main>

            {/* Footer Global */}
            <footer className="bg-cifp-neutral-50 border-t border-cifp-neutral-200">
                <div className="max-w-7xl mx-auto px-2 sm:px-8 py-1 sm:py-4">
                    <p className="text-[10px] sm:text-xs text-center text-cifp-neutral-600">
                        Política de privacidad. Copyright 2026. Lovelace
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default MainLayout
