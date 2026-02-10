import { Outlet } from 'react-router-dom'

function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-cifp-neutral-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-cifp-neutral-900">SmartEconomato</h1>
                </div>
            </header>

            {/* Main Content - flex-grow para empujar footer al fondo */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <Outlet />
            </main>

            {/* Footer Global */}
            <footer className="bg-cifp-neutral-50 border-t border-cifp-neutral-200">
                <div className="max-w-7xl mx-auto px-8 py-4">
                    <p className="text-xs text-center text-cifp-neutral-600">
                        Política de privacidad. Copyright 2026. Lovelace
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default MainLayout
