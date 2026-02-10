# Componentes UI - Sistema Lovelace

Biblioteca de componentes UI atómicos con la identidad corporativa del CIFP Virgen de Candelaria.

## 🎨 Paleta de Colores Corporativa

```javascript
cifp: {
  red: {
    DEFAULT: '#D32F2F',  // Rojo corporativo
    light: '#EF5350',
    dark: '#C62828',
  },
  blue: {
    DEFAULT: '#1976D2',  // Azul corporativo
    dark: '#1565C0',
    light: '#42A5F5',
  },
  neutral: {
    50-900: '...'  // Escala de grises
  }
}
```

## 📦 Componentes Disponibles

### Button

Botón con soporte para múltiples variantes y estado de carga.

**Props:**
- `variant`: `'primary' | 'secondary' | 'corporate'` (default: `'primary'`)
- `isLoading`: `boolean` - Muestra spinner y deshabilita el botón
- `disabled`: `boolean`
- `type`: `'button' | 'submit' | 'reset'`
- Soporta `forwardRef`

**Variantes:**
- **primary**: Fondo azul corporativo con hover oscuro
- **secondary**: Borde azul, fondo transparente con hover suave
- **corporate**: Fondo rojo corporativo para acciones importantes

**Ejemplo:**
```jsx
import { Button } from '@/components/ui'

<Button variant="primary" isLoading={loading}>
  Guardar
</Button>

<Button variant="corporate">
  Eliminar
</Button>
```

---

### Input

Input con validación y mensajes de error integrados.

**Props:**
- `label`: `string` - Etiqueta del campo (se muestra en mayúsculas y negrita)
- `error`: `string` - Mensaje de error a mostrar
- `icon`: `Component` - Componente de icono de lucide-react para mostrar a la izquierda
- `id`: `string` - ID del input (generado automáticamente si no se proporciona)
- `type`: `string` (default: `'text'`)
- Soporta `forwardRef` para react-hook-form

**Características:**
- Focus ring con color azul corporativo
- Estado de error con color rojo corporativo
- Mensaje de error debajo del campo
- **Iconos internos** a la izquierda del input
- **Labels en mayúsculas y negrita** según diseño corporativo
- Accesibilidad completa (aria-labels, aria-describedby)

**Ejemplo sin icono:**
```jsx
import { Input } from '@/components/ui'

<Input
  label="Correo electrónico"
  type="email"
  placeholder="usuario@example.com"
  error={errors.email}
  {...register('email')}
/>
```

**Ejemplo con icono:**
```jsx
import { Input } from '@/components/ui'
import { User, Lock, Mail } from 'lucide-react'

<Input
  label="Usuario"
  icon={User}
  placeholder="Ingresa tu usuario"
  error={errors.username}
/>

<Input
  label="Clave"
  type="password"
  icon={Lock}
  placeholder="Ingresa tu clave"
/>
```

---

### Card

Contenedor simple con fondo blanco y sombra.

**Props:**
- `className`: `string` - Clases adicionales
- Acepta cualquier contenido como children

**Características:**
- Fondo blanco
- Bordes redondeados (rounded-xl)
- Sombra media (shadow-md)
- Padding interno (p-6)

**Ejemplo:**
```jsx
import { Card } from '@/components/ui'

<Card>
  <h2>Título</h2>
  <p>Contenido de la card</p>
</Card>
```

---

## 🚀 Uso

Todos los componentes están exportados desde un único punto:

```jsx
import { Button, Input, Card } from '@/components/ui'
```

## 📝 Notas

- Todos los componentes usan `clsx` para gestión de clases
- Los componentes Input y Button soportan `forwardRef` para integración con react-hook-form
- Los colores corporativos están definidos en `tailwind.config.js`
- Todos los componentes son accesibles (WCAG 2.1)

## 🎯 Próximos Componentes

- [ ] Select / Dropdown
- [ ] Checkbox
- [ ] Radio Button
- [ ] Modal
- [ ] Toast / Alert
- [ ] Badge
- [ ] Avatar
