import { Card } from '../../components/ui'
import { Home } from 'lucide-react'

function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Home className="h-8 w-8 text-cifp-blue" />
                <h1 className="text-3xl font-bold text-cifp-neutral-900">Dashboard</h1>
            </div>

            <Card>
                <h2 className="text-xl font-semibold text-cifp-neutral-800 mb-4">
                    Bienvenido al Sistema Lovelace
                </h2>
                <p className="text-cifp-neutral-600">
                    Has iniciado sesión exitosamente. Esta es una página placeholder del dashboard.
                </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                    <div className="text-3xl font-bold text-cifp-blue">0</div>
                    <div className="text-sm text-cifp-neutral-600 mt-2">Usuarios</div>
                </Card>
                <Card className="text-center">
                    <div className="text-3xl font-bold text-cifp-red">0</div>
                    <div className="text-sm text-cifp-neutral-600 mt-2">Inventario</div>
                </Card>
                <Card className="text-center">
                    <div className="text-3xl font-bold text-cifp-neutral-700">0</div>
                    <div className="text-sm text-cifp-neutral-600 mt-2">Reportes</div>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage
