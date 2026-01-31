# Frontend - Sistema de Gestión de Agencias (Cooperativa Cobán)

Interfaz de usuario moderna y responsiva para la administración de agencias. Diseñada para ofrecer una experiencia fluida e intuitiva tanto para administradores como para usuarios con rol de consulta.

## Tecnologías Utilizadas

- **Framework**: React.js 18+
- **Tooling**: Vite
- **Estilos**: CSS3 Vanilla (Arquitectura de componentes)
- **Estado y Navegación**: React Hooks y React Router DOM
- **Cliente HTTP**: Axios

## Requisitos Previos

- Node.js instalado (v16 o superior recomendado).
- El backend del proyecto debe estar configurado y en ejecución.

## Instalación y Configuración

1. **Navegar a la carpeta del cliente**:
   ```bash
   cd client
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz de la carpeta `client`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Iniciar en modo desarrollo**:
   ```bash
   npm run dev
   ```

## Características Principales

- **Dashboard Principal**: Visualización de agencias activas con tarjetas interactivas.
- **Panel de Administración**: 
  - Gestión completa para usuarios con rol de **Administrador**.
  - Permisos restringidos para usuarios con rol de **Consulta** (solo visualización y cambio de estado).
- **Formulario Inteligente**:
  - Registro de agencias con horarios detallados.
  - Creación de nuevos municipios directamente desde el formulario.
  - Validaciones en tiempo real para campos duplicados.
- **Diseño Responsivo**: Adaptado para su uso en computadoras y dispositivos móviles.

## Estructura del Proyecto

```text
src/
├── components/   # Componentes reutilizables (Formularios, Tarjetas, Modales)
├── contexts/     # Contexto de autenticación y estado global
├── pages/        # Vistas principales (Home, Admin, Login)
├── services/     # Clientes de API y comunicación con el backend
├── assets/       # Imágenes y recursos estáticos
└── App.jsx       # Enrutador y estructura base
```

---
**Desarrollado para la Prueba Técnica de Cooperativa Cobán.**
