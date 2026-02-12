import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Lock, Mail, UserPlus } from 'lucide-react'
import { Card, Input, Button } from '../../components/ui'
import { useAuth } from '../../contexts/AuthProvider'
import logoImg from '../../assets/logo_cifp.png'
import fondoImg from '../../assets/FondoLogin.png'

function RegisterPage() {
    const navigate = useNavigate()
    const auth = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nombre: '',
        apellido1: '',
        apellido2: ''
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validación
        const newErrors = {}

        if (!formData.email) {
            newErrors.email = 'El email es obligatorio'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email no válido'
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria'
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la contraseña'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden'
        }

        if (!formData.nombre) {
            newErrors.nombre = 'El nombre es obligatorio'
        }

        if (!formData.apellido1) {
            newErrors.apellido1 = 'El primer apellido es obligatorio'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)
        setErrors({})

        try {
            const registerData = {
                email: formData.email,
                password: formData.password,
                nombre: formData.nombre,
                apellido1: formData.apellido1,
                ...(formData.apellido2 && { apellido2: formData.apellido2 })
            }

            await auth.register(registerData)

            alert('Registro exitoso. Por favor, inicia sesión.')
            navigate('/login')
        } catch (error) {
            console.error('Error en registro:', error)
            setErrors({ general: error?.message || 'Error al registrar usuario. Inténtalo de nuevo.' })
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
            className="h-screen flex items-center justify-center bg-cover bg-center px-2 sm:px-4 py-2 sm:py-6 overflow-auto"
            style={{ backgroundImage: `url(${fondoImg})` }}
        >
            <div className="w-[95%] sm:w-[90%] max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                {/* Card con animación de entrada y borde decorativo superior */}
                <Card className="relative shadow-2xl overflow-visible animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Borde decorativo superior con gradiente corporativo */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cifp-red via-cifp-blue to-cifp-red"></div>

                    <div className="pt-2 pb-2 px-2 sm:pt-8 sm:pb-6 sm:px-8">
                        {/* Logo CIFP */}
                        <div className="flex justify-center mb-1 sm:mb-4">
                            <img
                                src={logoImg}
                                alt="CIFP Virgen de Candelaria"
                                className="h-8 sm:h-20 w-auto object-contain"
                            />
                        </div>

                        {/* Título SmartEconomato */}
                        <h1 className="text-sm sm:text-2xl font-bold text-cifp-red text-center mt-1 mb-1 sm:mt-4 sm:mb-2">
                            SmartEconomato
                        </h1>
                        <p className="text-center text-gray-600 mb-2 sm:mb-6 text-xs sm:text-base hidden sm:block">Crear cuenta nueva</p>

                        {/* Formulario de registro */}
                        <form className="space-y-1 sm:space-y-5" onSubmit={handleSubmit}>
                            {/* Error general */}
                            {errors.general && (
                                <div className="bg-cifp-red/10 border border-cifp-red text-cifp-red px-2 py-1 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                                    {errors.general}
                                </div>
                            )}

                            {/* Nombre y Apellidos en grid horizontal para kiosk, vertical en tablets+ */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    label="Nombre"
                                    placeholder="Nombre"
                                    icon={User}
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    error={errors.nombre}
                                    required
                                />

                                <Input
                                    id="apellido1"
                                    name="apellido1"
                                    type="text"
                                    label="Apellido 1"
                                    placeholder="Apellido 1"
                                    icon={User}
                                    value={formData.apellido1}
                                    onChange={handleChange}
                                    error={errors.apellido1}
                                    required
                                />

                                <Input
                                    id="apellido2"
                                    name="apellido2"
                                    type="text"
                                    label="Apellido 2"
                                    placeholder="Opcional"
                                    icon={User}
                                    value={formData.apellido2}
                                    onChange={handleChange}
                                    error={errors.apellido2}
                                />
                            </div>

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email"
                                placeholder="tu.email@ejemplo.com"
                                icon={Mail}
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                required
                            />

                            {/* Contraseñas en grid horizontal */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    label="Contraseña"
                                    placeholder="Mín. 6 car."
                                    icon={Lock}
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    required
                                />

                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    label="Confirmar"
                                    placeholder="Repetir"
                                    icon={Lock}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={errors.confirmPassword}
                                    required
                                />
                            </div>

                            {/* Link de vuelta al login */}
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-xs sm:text-sm text-cifp-blue hover:text-cifp-blue-dark transition-colors inline-block"
                                >
                                    Ya tengo cuenta
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="corporate"
                                isLoading={isLoading}
                                className="w-full mt-1 sm:mt-6 py-2 sm:py-3 text-xs sm:text-base font-bold uppercase tracking-wide"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage
