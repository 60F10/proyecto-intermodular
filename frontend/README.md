# 🎨 Frontend - Sistema Lovelace

Frontend moderno para el Sistema de Gestión Lovelace del CIFP Virgen de Candelaria.

## 🚀 Stack Tecnológico

- **Framework:** React 18
- **Build Tool:** Vite 6
- **Routing:** React Router DOM 7
- **Estilos:** Tailwind CSS 3
- **Forms:** React Hook Form
- **Iconos:** Lucide React
- **Utilidades CSS:** `clsx` y `tailwind-merge`

## 📁 Arquitectura de Carpetas

Seguimos **Atomic Design Simplificado** + **Feature Slices**:

```
frontend/
├── public/               # Assets estáticos (favicon, etc.)
├── src/
│   ├── app/             # Configuración principal de la app
│   │   ├── App.jsx      # Componente raíz
│   │   └── router.jsx   # Configuración de rutas
│   ├── assets/          # Assets importables (imágenes, logos)
│   ├── components/      # Componentes reutilizables
│   │   └── ui/          # Átomos: Botones, Inputs, Cards
│   ├── features/        # Módulos funcionales (Feature Slices)
│   │   └── auth/        # Feature: Autenticación
│   │       └── LoginPage.jsx
│   ├── layouts/         # Layouts compartidos
│   │   └── MainLayout.jsx
│   ├── services/        # Servicios API y mocks
│   ├── types/           # TypeScript types / interfaces
│   ├── index.css        # Estilos globales + Tailwind
│   └── main.jsx         # Punto de entrada
├── index.html           # HTML base
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
└── package.json
```

## 🔧 Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (puerto 5173)
npm run dev

# Compilar para producción
npm run build

# Preview de build de producción
npm run preview
```

## 🎯 Próximos Pasos

1. **Autenticación:** Conectar formulario de login con API backend
2. **Componentes UI:** Crear biblioteca de componentes atómicos (Buttons, Inputs, etc.)
3. **Dashboard:** Implementar página principal después del login
4. **Gestión de Estado:** Implementar Context API o similar para auth state
5. **Modo Mock:** Implementar servicios mock para desarrollo sin backend

## 📝 Notas de Desarrollo

- **Variables de entorno:** Usa `VITE_USE_MOCK=true` para datos falsos durante desarrollo
- **Backend:** API disponible en `http://localhost:3000`
- **Arquitectura:** Solo modifica archivos en `/frontend`, nunca en `/backend`
- **Commits:** Usar commits semánticos (`feat:`, `fix:`, `docs:`, etc.)
- **Ramas:** Trabajar siempre en ramas `feature/nombre-tarea`

## 🎨 Guía de Estilos

- **Tailwind CSS:** Exclusivo para estilos
- **Accesibilidad:** Cumplir WCAG 2.1 (aria-labels, foco visible, contraste)
- **Responsive:** Mobile-first approach
- **Utilidades:** Usar `clsx` y `tailwind-merge` para clases condicionales

## 📖 Más Información

Consulta `MISSION_CONTROL.md` para el checklist de la tarea actual.
