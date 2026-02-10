import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import { Card, Input, Button } from '../../components/ui'
import logoImg from '../../assets/logo_cifp.png'
import fondoImg from '../../assets/FondoLogin.png'

function LoginPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validación simple
        const newErrors = {}
        if (!formData.username) {
            newErrors.username = 'El usuario es obligatorio'
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
            // TODO: Implementar lógica de autenticación con backend
            // Simulación de llamada API
            await new Promise(resolve => setTimeout(resolve, 2000))

            console.log('Login exitoso:', formData)

            // Redirigir al dashboard
            navigate('/dashboard')
        } catch (error) {
            console.error('Error en login:', error)
            setErrors({ general: 'Error al iniciar sesión. Inténtalo de nuevo.' })
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
            className="min-h-screen flex items-center justify-center md:justify-start bg-cover bg-center px-4 py-8"
            style={{ backgroundImage: `url(${fondoImg})` }}
        >
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl md:ml-24">
                {/* Card con animación de entrada y borde decorativo superior */}
                <Card className="relative shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Borde decorativo superior con gradiente corporativo */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cifp-red via-cifp-blue to-cifp-red"></div>

                    <div className="pt-8 pb-6 px-8">
                        {/* Logo CIFP */}
                        <div className="flex justify-center mb-4">
                            <img
                                src={logoImg}
                                alt="CIFP Virgen de Candelaria"
                                className="h-20 w-auto object-contain"
                            />
                        </div>

                        {/* Título SmartEconomato */}
                        <h1 className="text-2xl font-bold text-cifp-red text-center mt-4 mb-8">
                            SmartEconomato
                        </h1>

                        {/* Formulario de login */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Error general */}
                            {errors.general && (
                                <div className="bg-cifp-red/10 border border-cifp-red text-cifp-red px-4 py-3 rounded-lg text-sm">
                                    {errors.general}
                                </div>
                            )}

                            <Input
                                id="username"
                                name="username"
                                type="text"
                                label="Usuario"
                                placeholder="Ingresa tu usuario"
                                icon={User}
                                value={formData.username}
                                onChange={handleChange}
                                error={errors.username}
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
                                <a
                                    href="#"
                                    className="text-sm text-cifp-blue hover:text-cifp-blue-dark transition-colors inline-block"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    ¿Problemas con el usuario o la clave?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                variant="corporate"
                                isLoading={isLoading}
                                className="w-full mt-6 py-3 text-base font-bold uppercase tracking-wide"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage
