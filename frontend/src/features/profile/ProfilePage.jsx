import { useEffect, useState } from 'react'
import { Card, Input, Button } from '../../components/ui'
import { useAuth } from '../../contexts/AuthProvider'
import apiFetch from '../../services/api'

const ROLE_SUPER = 'SUPERADMIN'
const ROLE_ADMIN = 'ADMIN'
const ROLE_USER = 'USER'

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email)
}

export default function ProfilePage() {
  const { user: me } = useAuth()
  const myRole = me?.role || me?.rol || me?.roleName

  const [tab, setTab] = useState('usuario')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [errors, setErrors] = useState({})

  const [targetId, setTargetId] = useState(me?.id || me?._id || '')
  const [form, setForm] = useState({ id: '', nombre: '', apellido1: '', apellido2: '', email: '', role: ROLE_USER })

  useEffect(() => {
    if (me) {
      const id = me.id || me._id || me.usuarioId || null
      if (id) {
        setTargetId(id)
        loadProfile(id)
      }
    }
  }, [me])

  async function loadProfile(id) {
    if (!id) return
    setLoading(true)
    setMessage(null)
    setErrors({})
    try {
      const data = await apiFetch(`/users/${id}`)
      const role = data.role || data.rol || data.roleName
      if (myRole === ROLE_ADMIN && role === ROLE_SUPER) {
        setMessage('Acceso denegado: no puedes ver el perfil de un superadmin')
        setForm({ id: '', nombre: '', apellido1: '', apellido2: '', email: '', role: ROLE_USER })
      } else {
        setForm({
          id: data.id || data._id || data.usuarioId || '',
          nombre: data.nombre || '',
          apellido1: data.apellido1 || '',
          apellido2: data.apellido2 || '',
          email: data.email || '',
          role: role || ROLE_USER,
        })
        setMessage(null)
      }
    } catch (err) {
      setMessage(err.message || 'Error al cargar perfil')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(key) {
    return (e) => setForm({ ...form, [key]: e.target.value })
  }

  function validate() {
    const e = {}
    if (!form.nombre || form.nombre.trim().length < 2) e.nombre = 'Nombre inválido'
    if (!form.apellido1 || form.apellido1.trim().length < 2) e.apellido1 = 'Apellido inválido'
    if (!form.email || !validateEmail(form.email)) e.email = 'Email inválido'
    if (myRole === ROLE_SUPER && ![ROLE_SUPER, ROLE_ADMIN, ROLE_USER].includes(form.role)) e.role = 'Rol inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setLoading(true)
    setMessage(null)
    try {
      const id = form.id
      const payload = {
        nombre: form.nombre,
        apellido1: form.apellido1,
        apellido2: form.apellido2,
        email: form.email,
      }
      if (myRole === ROLE_SUPER) payload.role = form.role
      await apiFetch(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
      setMessage('Perfil guardado correctamente')
    } catch (err) {
      setMessage(err.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

    async function searchAndLoad(q) {
      const s = (q || '').toString().trim()
      if (!s) {
        setMessage('Introduce un término de búsqueda')
        return
      }

      // try by id first (UUID-ish)
      if (/^[0-9a-fA-F-]{8,}$/.test(s)) {
        try {
          await loadProfile(s)
          return
        } catch (err) {
          // fallback to list search
        }
      }

      setLoading(true)
      setMessage(null)
      try {
        const list = await apiFetch('/users')
        const ql = s.toLowerCase()
        const matches = (list || []).filter(u => {
          const fields = [u.id, u._id, u.usuarioId, u.email, u.nombre, u.apellido1, u.apellido2, (u.dni || '')].map(x => (x || '').toString().toLowerCase())
          const full = `${u.nombre || ''} ${(u.apellido1 || '')} ${(u.apellido2 || '')}`.toLowerCase()
          return fields.some(f => f.includes(ql)) || full.includes(ql)
        })
        if (matches.length === 0) {
          setMessage('No se han encontrado usuarios')
        } else if (matches.length === 1) {
          await loadProfile(matches[0].id || matches[0]._id || matches[0].usuarioId)
        } else {
          await loadProfile(matches[0].id || matches[0]._id || matches[0].usuarioId)
          setMessage(`${matches.length} usuarios encontrados, cargado el primero`)
        }
      } catch (err) {
        setMessage(err.message || 'Error en búsqueda')
      } finally {
        setLoading(false)
      }
    }

    async function loadMyProfile() {
      setLoading(true)
      setMessage(null)
      setErrors({})
      try {
        // force fresh response to avoid cached 304
        const data = await apiFetch(`/auth/me?ts=${Date.now()}`)
        const role = data.role || data.rol || data.roleName

        // If /auth/me returns only minimal info, try to fetch the full user by id.
        // Use the provider `me` as fallback to obtain an id when /auth/me is partial or cached.
        let full = data
        let possibleId = data.id || data._id || data.usuarioId || me?.id || me?._id || me?.usuarioId || null

        if ((!(data.nombre || data.apellido1 || data.apellido2)) && possibleId) {
          try {
            full = await apiFetch(`/users/${possibleId}`)
          } catch (e) {
            // ignore, we'll use whatever data we have
          }
        }

        // If still no id, try to find the user by email in the users list
        if ((!(full.nombre || full.apellido1 || full.apellido2)) && !possibleId) {
          const emailToFind = data.email || me?.email || ''
          if (emailToFind) {
            try {
              const list = await apiFetch('/users')
              const found = (list || []).find(u => (u.email || '').toLowerCase() === emailToFind.toLowerCase())
              if (found) {
                full = found
                possibleId = found.id || found._id || found.usuarioId || possibleId
              }
            } catch (e) {
              // ignore
            }
          }
        }

        if (myRole === ROLE_ADMIN && role === ROLE_SUPER) {
          setMessage('Acceso denegado: no puedes ver el perfil de un superadmin')
          setForm({ id: '', nombre: '', apellido1: '', apellido2: '', email: '', role: ROLE_USER })
        } else {
          setForm({
            id: full.id || full._id || full.usuarioId || possibleId || '',
            nombre: full.nombre || data.nombre || me?.nombre || '',
            apellido1: full.apellido1 || data.apellido1 || me?.apellido1 || '',
            apellido2: full.apellido2 || data.apellido2 || me?.apellido2 || '',
            email: full.email || data.email || me?.email || '',
            role: role || ROLE_USER,
          })
          setMessage(null)
        }
      } catch (err) {
        setMessage(err.message || 'Error al cargar perfil')
      } finally {
        setLoading(false)
      }
    }

    const canEditRole = myRole === ROLE_SUPER
    const canViewRole = myRole === ROLE_SUPER || myRole === ROLE_ADMIN

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-cifp-neutral-900">Panel Usuario</h1>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setTab('usuario')} className={`px-4 py-2 rounded-md ${tab === 'usuario' ? 'bg-cifp-blue text-white' : 'bg-cifp-neutral-100'}`}>Usuario</button>
      </div>

      {tab === 'usuario' && (
        <Card>
          <div className="mb-4">
            {(myRole === ROLE_SUPER || myRole === ROLE_ADMIN) ? (
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-cifp-neutral-900 mb-2 uppercase tracking-wide">Buscar usuario (ID / email / nombre / dni)</label>
                  <div className="flex items-center gap-2">
                    <Input value={targetId} onChange={(e) => setTargetId(e.target.value)} className="flex-1" />
                    <Button onClick={() => searchAndLoad(targetId)}>Buscar</Button>
                    <Button variant="secondary" onClick={() => loadMyProfile()}>Tu perfil</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => loadMyProfile()}>Tu perfil</Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input label="ID_usuario" value={form.id} readOnly />
              <Input label="Nombre" value={form.nombre} onChange={handleChange('nombre')} error={errors.nombre} />
              <Input label="Apellido 1" value={form.apellido1} onChange={handleChange('apellido1')} error={errors.apellido1} />
              <Input label="Apellido 2" value={form.apellido2} onChange={handleChange('apellido2')} />
            </div>

            <div>
              <Input label="Email" value={form.email} onChange={handleChange('email')} error={errors.email} />
              {canViewRole && (
                canEditRole ? (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-cifp-neutral-700 mb-1">Rol</label>
                    <select className="w-full border rounded px-2 py-1" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                      <option value={ROLE_USER}>USER</option>
                      <option value={ROLE_ADMIN}>ADMIN</option>
                      <option value={ROLE_SUPER}>SUPERADMIN</option>
                    </select>
                    {errors.role && <div className="text-sm text-red-500">{errors.role}</div>}
                  </div>
                ) : (
                  <Input label="Rol" value={form.role} readOnly />
                )
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="corporate" onClick={handleSave} isLoading={loading}>Modificar</Button>
          </div>

          {message && <div className="mt-4 text-center text-sm text-cifp-neutral-700">{message}</div>}
        </Card>
      )}

      
    </div>
  )
}
