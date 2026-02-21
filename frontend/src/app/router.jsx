import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import DashboardPage from '../features/dashboard/DashboardPage'
import IngredientsSummaryPage from '../features/ingredients/IngredientsSummaryPage'
import IngredientsFullPage from '../features/ingredients/IngredientsFullPage'
import ProfilePage from '../features/profile/ProfilePage'
import MainLayout from '../layouts/MainLayout'
import RequireAuth from '../components/RequireAuth'
import RecoverPage from '../features/auth/RecoverPage'

function AppRouter() {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/recover" element={<RecoverPage />} />

            {/* Rutas protegidas */}
            <Route path="/" element={<RequireAuth><MainLayout /></RequireAuth>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<IngredientsSummaryPage />} />
                <Route path="products/full" element={<IngredientsFullPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default AppRouter
