import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import { Card, Input, Button } from '../../components/ui'
import { useAuth } from '../../contexts/AuthProvider'
import logoImg from '../../assets/logo_cifp.png'
import fondoImg from '../../assets/FondoLogin.png'

function LoginPage() {
    const navigate = useNavigate()
    const auth = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validación simple
        const newErrors = {}
        if (!formData.email) {
            newErrors.email = 'El email es obligatorio'
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)
        setErrors({})

        try {
            // Use auth context to login (will store token and fetch profile)
            await auth.login({ email: formData.email, password: formData.password })
            navigate('/dashboard')
        } catch (error) {
            console.error('Error en login:', error)
            setErrors({ general: error?.message || 'Error al iniciar sesión. Inténtalo de nuevo.' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: undefined
            })
        }
    }

    return (
        <div
            className="h-screen flex items-center justify-center lg:justify-start bg-cover bg-center px-2 sm:px-4 py-2 sm:py-6 overflow-hidden"
            style={{ backgroundImage: `url(${fondoImg})` }}
        >
            <div className="w-[95%] sm:w-[90%] max-w-md md:max-w-md lg:max-w-lg xl:max-w-xl lg:ml-20 xl:ml-[10%]">
                {/* Card con animación de entrada y borde decorativo superior */}
                <Card className="relative shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Borde decorativo superior con gradiente corporativo */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cifp-red via-cifp-blue to-cifp-red"></div>

                    <div className="pt-3 pb-2 px-3 sm:pt-8 sm:pb-6 sm:px-8">
                        {/* Logo CIFP */}
                        <div className="flex justify-center mb-1 sm:mb-4">
                            <img
                                src={logoImg}
                                alt="CIFP Virgen de Candelaria"
                                className="h-10 sm:h-20 w-auto object-contain"
                            />
                        </div>

                        {/* Título SmartEconomato */}
                        <h1 className="text-base sm:text-2xl font-bold text-cifp-red text-center mt-1 mb-2 sm:mt-4 sm:mb-8">
                            SmartEconomato
                        </h1>

                        {/* Formulario de login */}
                        <form className="space-y-2 sm:space-y-5" onSubmit={handleSubmit}>
                            {/* Error general */}
                            {errors.general && (
                                <div className="bg-cifp-red/10 border border-cifp-red text-cifp-red px-2 py-1 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                                    {errors.general}
                                </div>
                            )}

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email"
                                placeholder="Ingresa tu email"
                                icon={User}
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                required
                            />

                            <Input
                                id="password"
                                name="password"
                                type="password"
                                label="Clave"
                                placeholder="Ingresa tu clave"
                                icon={Lock}
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                required
                            />

                            {/* Enlace de ayuda centrado */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => navigate('/recover')}
                                    className="text-xs sm:text-sm text-cifp-blue hover:text-cifp-blue-dark transition-colors inline-block"
                                >
                                    ¿Problemas con el usuario o la clave?
                                </button>
                            </div>

                            <Button
                                type="submit"
                                variant="corporate"
                                isLoading={isLoading}
                                className="w-full mt-2 sm:mt-6 py-2 sm:py-3 text-sm sm:text-base font-bold uppercase tracking-wide"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>

                            {/* Enlace de registro */}
                            <div className="text-center mt-1 sm:mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/register')}
                                    className="text-xs sm:text-sm text-cifp-blue hover:text-cifp-blue-dark transition-colors inline-block"
                                >
                                    ¿No tienes cuenta? Regístrate aquí
                                </button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage
