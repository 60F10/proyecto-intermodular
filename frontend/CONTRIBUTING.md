# Contribuir al Frontend - SmartEconomato

¡Gracias por contribuir al proyecto! Esta guía te ayudará a mantener la consistencia del código.

## 📋 Requisitos Previos

- Node.js 18+ y npm 9+
- Git configurado
- Editor con soporte ESLint y Prettier (recomendado: VS Code)



## 🌿 Flujo de Trabajo Git

Crear PR en GitHub con:
- Título descriptivo
- Descripción de cambios
- Screenshots/videos si hay cambios visuales

## 📐 Arquitectura

### Atomic Design + Feature Slices

```
src/
├── components/ui/      # Componentes atómicos (Button, Input, Card)
├── features/          # Módulos por funcionalidad
│   ├── auth/         # Sistema de autenticación
│   └── dashboard/    # Dashboard
├── layouts/          # Layouts globales
├── assets/           # Imágenes, logos
└── app/              # Configuración app
```

**Reglas:**
1. **Components UI**: Solo componentes reutilizables, sin lógica de negocio
2. **Features**: Código agrupado por funcionalidad, puede tener subcarpetas `components/`, `hooks/`, `utils/`
3. **Layouts**: Estructuras que wrappean páginas (header, footer, sidebar)

## 🎨 Sistema de Diseño

### Colores Corporativos CIFP

**Siempre usar clases de Tailwind:**

```jsx
// ✅ CORRECTO
<button className="bg-cifp-blue text-white">Aceptar</button>
<button className="bg-cifp-red text-white">Eliminar</button>
<p className="text-cifp-neutral-700">Texto</p>

// ❌ INCORRECTO
<button className="bg-blue-500">Aceptar</button>
<button style={{ backgroundColor: '#1976D2' }}>Aceptar</button>
```

### Componentes Base

**Usar siempre componentes de `/components/ui`:**

```jsx
import { Button, Input, Card } from '@/components/ui'

// ✅ CORRECTO
<Button variant="primary">Guardar</Button>
<Input label="Usuario" placeholder="Ingresa usuario" />

// ❌ INCORRECTO
<button>Guardar</button>
<input placeholder="Ingresa usuario" />
```

## 📝 Convenciones de Código

### Nombres de Archivos

- **Componentes**: `PascalCase.jsx` → `LoginPage.jsx`, `Button.jsx`
- **Hooks**: `camelCase.js` → `useAuth.js`, `useForm.js`
- **Utils**: `camelCase.js` → `formatDate.js`, `validation.js`
- **Assets**: `kebab-case.png` → `logo-cifp.png`, `fondo-login.png`

### Estructura de Componentes

```jsx
// 1. Imports (agrupados: react, third-party, local)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'

// 2. Componente
function MyComponent() {
    // 3. Hooks (orden: router, state, effects)
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    
    // 4. Event handlers
    const handleClick = () => { ... }
    
    // 5. Return
    return <div>...</div>
}

// 6. Export
export default MyComponent
```

### Props Naming

```jsx
// ✅ Booleanos con is/has
isLoading, hasError, isDisabled

// ✅ Handlers con handle
handleClick, handleSubmit, handleChange

// ❌ Evitar
loading, error, disabled
onClick, onSubmit, onChange (usar estos solo en componentes base)
```

## ✅ Checklist Pre-Commit

Antes de hacer commit:

- [ ] ¿El código funciona sin errores?
- [ ] ¿Usa componentes de `/components/ui`?
- [ ] ¿Usa colores corporativos `cifp-*`?
- [ ] ¿Nombres de archivo en convención correcta?
- [ ] ¿Funciona en mobile y desktop?
- [ ] ¿Sin `console.log` innecesarios?
- [ ] ¿Commit message semántico?

## 🚫 Antipatrones Comunes

### ❌ NO crear carpetas `index.jsx`

```
// ❌ INCORRECTO
components/Button/index.jsx

// ✅ CORRECTO
components/ui/Button.jsx
```

### ❌ NO mezclar lógica en componentes UI

```jsx
// ❌ INCORRECTO - fetch dentro de componente UI
function Button() {
    const handleClick = async () => {
        await fetch('/api/data')
    }
    return <button onClick={handleClick}>Click</button>
}

// ✅ CORRECTO - lógica en feature
function LoginPage() {
    const handleLogin = async () => {
        await fetch('/api/login')
    }
    return <Button onClick={handleLogin}>Login</Button>
}
```

### ❌ NO usar estilos inline (excepto dynamic values)

```jsx
// ❌ INCORRECTO
<div style={{ color: 'red', padding: '10px' }}>...</div>

// ✅ CORRECTO
<div className="text-cifp-red p-4">...</div>

// ✅ OK para valores dinámicos
<div style={{ backgroundImage: `url(${imageUrl})` }}>...</div>
```

## 🔧 Configuración del Editor

### VS Code (Recomendado)

**Extensiones necesarias:**
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense

**Settings (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## 📚 Recursos Útiles

- **Guía de Estilo**: [STYLE_GUIDE.md](./STYLE_GUIDE.md)
- **Componentes UI**: [README.md](./src/components/ui/README.md)
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **Lucide Icons**: https://lucide.dev/icons

## 🆘 ¿Necesitas Ayuda?

- Revisa la documentación en `/frontend/STYLE_GUIDE.md`
- Consulta ejemplos en `/frontend/src/components/ui/`
- Abre un issue en GitHub
- Contacta al equipo en el canal de desarrollo

---

**¡Gracias por mantener el código limpio y consistente!** 🎉
