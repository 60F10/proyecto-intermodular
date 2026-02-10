import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { Card, Input, Button } from '../../components/ui'

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

        // TODO: Implementar lógica de autenticación con backend
        setTimeout(() => {
            console.log('Login attempt:', formData)
            setIsLoading(false)
            // navigate('/')
        }, 2000)
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cifp-blue-light/20 via-white to-cifp-red-light/10 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Logo y título */}
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-cifp-blue to-cifp-blue-dark rounded-full flex items-center justify-center shadow-lg">
                        <LogIn className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-cifp-neutral-900">
                        Sistema Lovelace
                    </h2>
                    <p className="mt-2 text-sm text-cifp-neutral-600">
                        CIFP Virgen de Candelaria
                    </p>
                </div>

                {/* Formulario de login */}
                <Card className="shadow-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            label="Usuario"
                            placeholder="Ingresa tu usuario"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                            required
                        />

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            label="Contraseña"
                            placeholder="Ingresa tu contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            className="w-full"
                        >
                            <LogIn className="h-4 w-4" />
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>
                </Card>

                {/* Información adicional */}
                <div className="text-center text-sm text-cifp-neutral-600">
                    <p>¿Problemas para acceder? Contacta al administrador.</p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
