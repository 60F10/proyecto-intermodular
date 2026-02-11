import { Card } from '../../components/ui'
import { Home } from 'lucide-react'

function DashboardPage() {
    return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Home className="h-8 w-8 text-cifp-blue" />
            <h1 className="text-3xl font-bold text-cifp-neutral-900">Dashboard</h1>
          </div>

          {/* Removed welcome card and summary stats to make navbar buttons larger and more prominent */}
          <div className="mt-2">
            {/* Intentionally left empty to prioritize large navigation tiles below (navbar provides the view tiles) */}
          </div>
        </div>
    )
}

export default DashboardPage
