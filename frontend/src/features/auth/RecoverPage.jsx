import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Button } from '../../components/ui'
import fondoImg from '../../assets/FondoLogin.png'
import logoImg from '../../assets/logo_cifp.png'
import apiFetch from '../../services/api'

export default function RecoverPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const useMock = import.meta.env.VITE_USE_MOCK === 'true'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (useMock) {
        // Simular envío
        await new Promise((r) => setTimeout(r, 1000))
        setMessage(`Se ha enviado un correo a ${email} con un nombre de usuario y clave provisional.`)
        setIsLoading(false)
        return
      }

      // Intentar llamada real al backend
      await apiFetch('/auth/recover', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })

      setMessage(`Se ha enviado un correo a ${email} con un nombre de usuario y clave provisional.`)
    } catch (err) {
      console.error('Recover error', err)
      setError(err.message || 'Error al solicitar recuperación')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    // Intentar cerrar la pestaña si fue abierta por script; si no, navegar al login
    try {
      window.close()
    } catch (e) { }
    navigate('/login')
  }

  return (
    <div
      className="h-screen flex items-center justify-center lg:justify-end bg-cover bg-center px-2 sm:px-4 py-2 sm:py-6 overflow-hidden"
      style={{ backgroundImage: `url(${fondoImg})` }}
    >
      <div className="w-[95%] sm:w-[90%] max-w-md md:max-w-md lg:max-w-lg xl:max-w-xl lg:mr-20 xl:mr-[10%]">
        <Card className="relative shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cifp-red via-cifp-blue to-cifp-red"></div>
          <div className="pt-3 pb-2 px-3 sm:pt-8 sm:pb-6 sm:px-8">
            <div className="flex justify-center mb-1 sm:mb-4">
              <img src={logoImg} alt="Logo" className="h-10 sm:h-20 w-auto object-contain" />
            </div>

            <h2 className="text-base sm:text-xl font-bold text-center mb-2 sm:mb-4">Recuperar cuenta</h2>

            {message ? (
              <div className="space-y-2 sm:space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-800 px-2 py-1 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                  {message}
                </div>
                <div className="text-center">
                  <Button variant="corporate" onClick={handleBack} className="text-xs sm:text-base py-2 sm:py-3">Volver al login</Button>
                </div>
              </div>
            ) : (
              <form className="space-y-2 sm:space-y-5" onSubmit={handleSubmit}>
                <p className="text-center text-xs sm:text-sm">Ingresa un correo electrónico válido</p>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-2 py-1 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">{error}</div>
                )}

                <Input
                  id="recover-email"
                  name="email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between gap-2">
                  <Button type="submit" variant="corporate" isLoading={isLoading} disabled={isLoading || !email} className="text-xs sm:text-base py-2 sm:py-3">
                    Enviar
                  </Button>
                  <Button variant="ghost" onClick={handleBack} className="text-xs sm:text-base py-2 sm:py-3">Volver</Button>
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
