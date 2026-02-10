import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../features/auth/LoginPage'
import MainLayout from '../layouts/MainLayout'

function AppRouter() {
    return (
        <Routes>
            {/* Ruta pública - Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas - Placeholder */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/login" replace />} />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default AppRouter
