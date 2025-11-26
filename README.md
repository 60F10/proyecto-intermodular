# 🚀 Proyecto Intermodular — Lovelace  
Aplicación web completa para la gestión del Economato CIFP Virgen de Candelaria.  
Desarrollado siguiendo estándares profesionales, buenas prácticas y un flujo de trabajo colaborativo real.

---

## 📌 Descripción del Proyecto

Este proyecto forma parte del **Proyecto Intermodular del ciclo DAW**.  
Consiste en el desarrollo de una aplicación web completa que gestione todas las operaciones del Economato CIFP Virgen de Candelaria.

El sistema incluirá:

- Autenticación y autorización de usuarios  
- Gestión de productos y stock  
- Registro y control de pedidos  
- Panel administrativo  
- Integración con base de datos PostgreSQL  
- Despliegue en un entorno Linux mediante Docker y Nginx

Todo el proyecto está organizado dentro de una **GitHub Organization**, con un flujo de trabajo basado en Pull Requests y revisión de código para simular un entorno de desarrollo profesional.

---

## 🧩 Tecnologías del Proyecto

### 🟦 Frontend
- **React 18**
- **Vite**
- **CSS modular**
- Variables CSS para modo claro/oscuro
- Comunicación con el backend mediante API REST

### 🟥 Backend
- **NestJS** (arquitectura modular)
- **TypeScript**
- **TypeORM**
- **PostgreSQL**
- **Autenticación JWT propia**
- Configuración mediante variables de entorno `.env`

### 🟩 Infraestructura
- **Docker**
- **Docker Compose**
- **Nginx (Reverse Proxy)**
- **Máquina Virtual Linux**
- Scripts de despliegue/automatización

### 🟨 Control de versiones, gestión y trabajo en equipo
- Git + GitHub
- GitHub Organization
- Forks obligatorios
- Ramas `feature/*`
- Pull Requests y código revisado
- `CONTRIBUTING.md` con todas las normas de trabajo
- GitHub Projects (Kanban / Sprints)

---

## 📁 Estructura del Repositorio

```bash
proyecto-intermodular/
├── backend/          # API NestJS (pendiente de configuración completa)
├── frontend/         # Aplicación React (pendiente de implementación)
├── nginx/            # Archivos de configuración del proxy inverso
├── scripts/          # Scripts de instalación / despliegue
├── docs/             # Documentación adicional del proyecto
├── README.md         # Este archivo
├── CONTRIBUTING.md   # Guía para colaboradores
└── .gitignore

