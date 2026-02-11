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
        await new Promise((r) => setTimeout(r, 1000))
        setMessage(`Se ha enviado un correo a ${email} con un nombre de usuario y clave provisional.`)
        return
      }

      await apiFetch('/auth/recover', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })

      setMessage(`Se ha enviado un correo a ${email} con un nombre de usuario y clave provisional.`)
    } catch (err) {
      console.error('Recover error', err)
      setError(err?.message || 'Error al solicitar recuperación')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    try {
      window.close()
    } catch (e) {
      // ignore
    }
    navigate('/login')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center md:justify-end bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: `url(${fondoImg})` }}
    >
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl md:mr-24">
        <Card className="relative shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cifp-red via-cifp-blue to-cifp-red"></div>
          <div className="pt-8 pb-6 px-8">
            <div className="flex justify-center mb-4">
              <img src={logoImg} alt="Logo" className="h-20 w-auto object-contain" />
            </div>

            <h2 className="text-xl font-bold text-center mb-4">Recuperar cuenta</h2>

            {message ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  {message}
                </div>
                <div className="text-center">
                  <Button variant="corporate" onClick={handleBack}>Volver al login</Button>
                </div>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <p className="text-center text-sm">Ingresa un correo electrónico válido</p>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">{error}</div>
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

                <div className="flex items-center justify-between">
                  <Button type="submit" variant="corporate" isLoading={isLoading} disabled={isLoading || !email}>
                    Enviar
                  </Button>
                  <Button variant="ghost" onClick={handleBack}>Volver</Button>
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
