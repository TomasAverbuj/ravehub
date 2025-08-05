# 🎵 RaveHub - Plataforma de Eventos Musicales

## 📋 Descripción del Proyecto

RaveHub es una aplicación web moderna desarrollada en Vue.js que permite a los usuarios descubrir, comprar tickets y gestionar eventos musicales. La plataforma incluye funcionalidades de autenticación, chat en tiempo real, gestión de perfiles de usuario y administración de eventos.

## 🚀 Características Principales

- **Autenticación de Usuarios**: Registro, login y recuperación de contraseñas
- **Gestión de Eventos**: Visualización, búsqueda y compra de tickets
- **Chat en Tiempo Real**: Comunicación entre usuarios y administradores
- **Perfiles de Usuario**: Gestión de información personal y foto de perfil
- **Sistema de Comentarios**: Interacción social en eventos
- **Panel de Administración**: Gestión de usuarios y eventos
- **Modo Oscuro/Claro**: Interfaz adaptable a preferencias del usuario
- **Diseño Responsivo**: Optimizado para dispositivos móviles y desktop

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Vue.js 3, Vite
- **Estilos**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Chat**: Firebase Realtime Database
- **Deployment**: Vercel

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/TomasAverbuj/ravehub.git
   cd ravehub
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Crear un proyecto en Firebase Console
   - Habilitar Authentication, Firestore y Storage
   - Copiar las credenciales de configuración
   - Crear archivo `.env` con las variables de entorno

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

## 📁 Estructura del Proyecto

```
ravehub/
├── docs/                    # Documentación del proyecto
│   ├── cuenta-profe.txt     # Credenciales de prueba
│   ├── datos.txt           # Datos de ejemplo
│   ├── reglas-firestore.txt # Reglas de seguridad Firestore
│   └── reglas-storage.txt   # Reglas de seguridad Storage
├── public/                  # Archivos estáticos
├── src/
│   ├── components/          # Componentes Vue reutilizables
│   ├── pages/              # Páginas de la aplicación
│   ├── services/           # Servicios de Firebase
│   ├── router/             # Configuración de rutas
│   └── utils/              # Utilidades y helpers
└── README.md               # Este archivo
```

## 🔐 Credenciales de Prueba

Para probar la aplicación, puedes usar las credenciales disponibles en `docs/cuenta-profe.txt`:

- **Email**: profe@davinci.com
- **Contraseña**: (ver archivo de documentación)

## 🌐 Funcionalidades por Página

### Páginas Principales
- **Home**: Página principal con eventos destacados
- **Events**: Catálogo completo de eventos
- **Login/Register**: Autenticación de usuarios
- **MyProfile**: Gestión del perfil personal
- **Chat**: Sistema de mensajería en tiempo real
- **Admin**: Panel de administración (solo para admins)

### Funcionalidades Especiales
- **PurchaseTicket**: Proceso de compra de tickets
- **EventDetail**: Detalles completos de eventos
- **MyTickets**: Historial de tickets comprados
- **UserProfile**: Perfiles de otros usuarios

## 🔧 Configuración de Firebase

### Firestore Rules
Las reglas de seguridad están configuradas en `docs/reglas-firestore.txt`

### Storage Rules
Las reglas de almacenamiento están en `docs/reglas-storage.txt`

## 📱 Características de UX/UI

- **Diseño Moderno**: Interfaz limpia y atractiva
- **Navegación Intuitiva**: Menú lateral y navegación por breadcrumbs
- **Notificaciones**: Sistema de alertas para acciones del usuario
- **Loading States**: Indicadores de carga para mejor UX
- **Error Handling**: Manejo elegante de errores

## 🚀 Deployment

El proyecto está configurado para deployment en Vercel con las siguientes configuraciones:
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: 18.x

## 👥 Autores

- **Tomas Averbuj** - Desarrollo Frontend y Backend
- **Compañero de Proyecto** - Colaboración en desarrollo

## 📄 Licencia

Este proyecto fue desarrollado como parte del curso de Desarrollo Web en DaVinci.

---

**Nota**: Para más detalles sobre la configuración específica, consultar los archivos en la carpeta `docs/`. 