# Guía de Estilo - Frontend SmartEconomato

## 📐 Arquitectura

### Atomic Design + Feature Slices

```
frontend/src/
├── components/ui/        # Componentes atómicos reutilizables
├── features/            # Módulos por funcionalidad
│   ├── auth/           # Feature: Autenticación
│   ├── dashboard/      # Feature: Dashboard
│   └── ...
├── layouts/            # Layouts globales
├── assets/             # Imágenes, logos, recursos
└── app/                # Configuración de la app
```

**Reglas:**
- ✅ **Components UI**: Solo componentes puros, sin lógica de negocio
- ✅ **Features**: Agrupan componentes, hooks, y lógica por funcionalidad
- ✅ **Layouts**: Estructuras globales que wrappean páginas

---

## 🎨 Sistema de Diseño

### Paleta de Colores CIFP

**Siempre usar clases de Tailwind con colores corporativos:**

```jsx
// ✅ CORRECTO
<button className="bg-cifp-blue text-white">Aceptar</button>
<button className="bg-cifp-red text-white">Eliminar</button>

// ❌ INCORRECTO
<button className="bg-blue-500 text-white">Aceptar</button>
<button style={{ backgroundColor: '#1976D2' }}>Aceptar</button>
```

**Colores disponibles:**
- `cifp-red` - #D32F2F (acciones importantes, eliminar)
- `cifp-blue` - #1976D2 (acciones principales)
- `cifp-neutral-{50-900}` - Escala de grises

---

## 🧩 Componentes UI

### Uso de Componentes Base

**Siempre usar los componentes de `/components/ui` en lugar de HTML nativo:**

```jsx
// ✅ CORRECTO
import { Button, Input, Card } from '@/components/ui'

<Button variant="primary">Guardar</Button>
<Input label="Nombre" placeholder="Ingresa tu nombre" />

// ❌ INCORRECTO
<button>Guardar</button>
<input placeholder="Ingresa tu nombre" />
```

### Crear Nuevos Componentes UI

1. Crear archivo en `/components/ui/ComponentName.jsx`
2. Usar `forwardRef` si acepta `ref`
3. Usar `clsx` para clases condicionales
4. Documentar props en comentario JSDoc
5. Añadir export a `/components/ui/index.js`
6. Documentar en `/components/ui/README.md`

**Ejemplo:**
```jsx
import { forwardRef } from 'react'
import { clsx } from 'clsx'

/**
 * Checkbox component with corporate styling
 * @param {string} label - Label text
 * @param {boolean} checked - Checked state
 */
const Checkbox = forwardRef(({ label, checked, className, ...props }, ref) => {
    return (
        <label className={clsx('flex items-center gap-2', className)}>
            <input
                ref={ref}
                type="checkbox"
                checked={checked}
                className="accent-cifp-blue"
                {...props}
            />
            <span className="text-cifp-neutral-900">{label}</span>
        </label>
    )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
```

---

## 📝 Convenciones de Código

### Nombres de Archivos y Componentes

```
✅ CORRECTO:
- PascalCase para componentes: LoginPage.jsx, Button.jsx
- camelCase para utilidades: useAuth.js, formatDate.js
- kebab-case para assets: logo-cifp.png, fondo-login.png

❌ INCORRECTO:
- loginPage.jsx
- button.jsx
- LogoCIFP.png
```

### Estructura de Componentes

**Orden de elementos en un componente:**

```jsx
// 1. Imports
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { Button, Input } from '@/components/ui'

// 2. Componente
function LoginPage() {
    // 3. Hooks (en orden: router, state, effects)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({})
    
    // 4. Event handlers
    const handleSubmit = (e) => { ... }
    const handleChange = (e) => { ... }
    
    // 5. Render helpers (opcional)
    const renderError = () => { ... }
    
    // 6. Return (JSX)
    return (
        <div>...</div>
    )
}

// 7. Export
export default LoginPage
```

### Naming Conventions

```jsx
// ✅ CORRECTO
const [isLoading, setIsLoading] = useState(false)
const [hasError, setHasError] = useState(false)
const handleSubmit = () => {}
const handleChange = () => {}

// ❌ INCORRECTO
const [loading, setLoading] = useState(false)
const [error, setError] = useState(false)
const onSubmit = () => {}
const onChange = () => {}
```

---

## 🎯 Props y TypeScript (Opcional)

### Documentar Props con JSDoc

```jsx
/**
 * Button component with multiple variants
 * @param {'primary' | 'secondary' | 'corporate'} variant - Button style variant
 * @param {boolean} isLoading - Shows loading spinner
 * @param {boolean} disabled - Disables button
 * @param {React.ReactNode} children - Button content
 */
```

---

## 🎨 Tailwind CSS

### Orden de Clases

Usar este orden para mejor legibilidad:

```jsx
className="
  // 1. Layout (display, position)
  flex items-center justify-center relative
  
  // 2. Tamaño (width, height, padding, margin)
  w-full h-20 px-4 py-2 mt-4
  
  // 3. Tipografía
  text-xl font-bold text-center
  
  // 4. Colores
  bg-cifp-blue text-white
  
  // 5. Bordes
  border border-gray-300 rounded-lg
  
  // 6. Efectos
  shadow-lg hover:bg-cifp-blue-dark transition-all duration-200
"
```

### No usar Estilos Inline

```jsx
// ✅ CORRECTO
<div className="bg-cifp-blue text-white p-4">...</div>

// ❌ INCORRECTO (solo usar para valores dinámicos como backgroundImage)
<div style={{ backgroundColor: '#1976D2', color: 'white' }}>...</div>
```

---

## 🔄 Estado y Datos

### useState para Estado Local

```jsx
// ✅ CORRECTO
const [formData, setFormData] = useState({
    username: '',
    password: ''
})

// Actualizar
setFormData({ ...formData, username: 'nuevo' })

// ❌ INCORRECTO - Mutar estado directamente
formData.username = 'nuevo'
setFormData(formData)
```

### Fetch de Datos

```jsx
// ✅ CORRECTO - Con try/catch
const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(formData)
        })
        
        if (!response.ok) throw new Error('Login failed')
        
        const data = await response.json()
        navigate('/dashboard')
    } catch (error) {
        console.error('Error:', error)
        setError('Error al iniciar sesión')
    } finally {
        setIsLoading(false)
    }
}
```

---

## 📁 Estructura de Features

Cada feature debe tener:

```
features/auth/
├── LoginPage.jsx        # Página principal
├── components/          # Componentes específicos del feature (opcional)
│   └── LoginForm.jsx
├── hooks/               # Custom hooks (opcional)
│   └── useAuth.js
└── utils/               # Utilidades del feature (opcional)
    └── validation.js
```

---

## 🚫 Antipatrones a Evitar

### ❌ No usar `index.jsx` para componentes

```
// ❌ INCORRECTO
components/Button/index.jsx

// ✅ CORRECTO
components/ui/Button.jsx
```

### ❌ No crear componentes genéricos dentro de features

```jsx
// ❌ INCORRECTO - Button dentro de feature
features/auth/Button.jsx

// ✅ CORRECTO - Button reutilizable en components/ui
components/ui/Button.jsx
```

### ❌ No mezclar lógica de negocio en componentes UI

```jsx
// ❌ INCORRECTO
function Button({ onClick }) {
    const handleClick = async () => {
        await fetch('/api/users') // ❌ Lógica de negocio aquí
        onClick()
    }
    
    return <button onClick={handleClick}>Click</button>
}

// ✅ CORRECTO
function Button({ onClick, ...props }) {
    return <button onClick={onClick} {...props} />
}
```

---

## ✅ Checklist para Crear Componentes

Antes de hacer commit de un nuevo componente:

- [ ] ¿Está en la carpeta correcta? (ui/ o feature específico)
- [ ] ¿Usa componentes base de `/components/ui`?
- [ ] ¿Usa colores corporativos (`cifp-*`)?
- [ ] ¿Tiene `forwardRef` si necesita refs?
- [ ] ¿Props documentadas con JSDoc?
- [ ] ¿Funciona en mobile y desktop?
- [ ] ¿Tiene accesibilidad (aria-labels)?
- [ ] ¿Exportado en barrel file si es UI?
- [ ] ¿Documentado en README.md si es UI?

---

## 🔧 Herramientas Recomendadas

### VS Code Extensions
- **ESLint** - Linting automático
- **Prettier** - Formateo de código
- **Tailwind CSS IntelliSense** - Autocompletado de clases
- **ES7+ React/Redux/React-Native snippets** - Snippets útiles

### Snippets Útiles

**`rfc` - React Function Component:**
```jsx
function ComponentName() {
    return (
        <div></div>
    )
}

export default ComponentName
```

**`rfr` - React Function Component with forwardRef:**
```jsx
import { forwardRef } from 'react'

const ComponentName = forwardRef((props, ref) => {
    return (
        <div ref={ref}></div>
    )
})

ComponentName.displayName = 'ComponentName'

export default ComponentName
```

---

## 📚 Recursos

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [Lucide Icons](https://lucide.dev/icons)
- [React Hook Form](https://react-hook-form.com)
