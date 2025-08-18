## Cambios realizados | 17 de agosto 2025

### app.js
- Se agregó gestión de sesiones con `express-session` para mantener el usuario logueado y su rol.
- Redirección automática en `/` según el rol del usuario (apicultor o administrador).
- Nuevas rutas para paneles:
  - `/paneladministrador` (administrador)
  - `/panelapicultor` (apicultor)
- Rutas de administración:
  - `/admin/usuarios`: muestra usuarios desde la base de datos.
  - `/admin/nodos`: muestra la vista de nodos.
- Mejoras en la ruta de login (`/login`): guarda el rol en la sesión y lo devuelve en la respuesta.
- Nueva API `/api/usuario` para obtener datos del usuario logueado.
- Especificación de layout en cada vista (`layout` para admin, `layout-apicultor` para apicultor).
- Rutas para recuperación y restablecimiento de contraseña.

### views/layout.ejs
- Diseño base para el panel de administrador (navbar y sidebar).
- Enlaces en la barra lateral para usuarios y nodos.
- Inclusión de estilos y scripts (Tailwind, Font Awesome, DataTables, jQuery).
- Mejor estructura para mostrar el contenido principal con el layout.

### views/layout-apicultor.ejs
- Layout específico para el panel de apicultor, con navbar y sidebar personalizados.
- Enlaces de navegación adaptados al rol de apicultor.
- Inclusión de estilos y scripts necesarios.

### views/panelapicultor.ejs
- Eliminada la estructura de layout (navbar, sidebar, `<html>`, `<body>`).
- Solo contiene el contenido específico del panel de apicultor, listo para el layout correspondiente.

### views/configuracionperfil.ejs
- Eliminada la estructura de layout, dejando solo el contenido de configuración de perfil.
- Script para cargar datos del usuario logueado desde la API.
- Formulario y campos en modo solo lectura.

### views/admin-nodos.ejs
- Estructura para mostrar información de nodos en tarjetas.
- Botones para ver gráficos y eliminar nodos.

### views/admin-usuarios.ejs
- Muestra la lista de usuarios obtenida desde la base de datos.
- Uso del layout de administrador para coherencia visual.

---

**Resumen:**  
Se organizaron las vistas para que cada una utilice el layout adecuado según el rol, se mejoró la gestión de sesiones y rutas, y se separó el contenido de las vistas del diseño general para evitar solapamientos y errores