/**
 * Express & Node.js Fundamentals Guide
 *
 * Demostración de arquitectura de middleware, enrutamiento HTTP RESTful,
 * renderizado del lado del servidor (SSR) con EJS y configuración de Express.
 *
 * @author Kevin Andrey Herrera Silva <kahs_kevin@hotmail.com>
 */

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

// ==========================================
// 1. Configuraciones del Servidor (Settings)
// ==========================================
app.set('appName', 'Express Learning Architecture');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ==========================================
// 2. Middlewares (Pipeline de Procesamiento)
// ==========================================

// Parsing del cuerpo de peticiones JSON
app.use(express.json());

// Logger personalizado para inspección de peticiones entrantes
function customLogger(req, res, next) {
  console.log(`[REQUEST] ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next(); // Pasa el control al siguiente middleware en la cadena
}
app.use(customLogger);

// Logger HTTP para entorno de desarrollo
app.use(morgan('dev'));

// Servicio de archivos estáticos (CSS, JS cliente, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 3. Enrutamiento (REST Routing & Views)
// ==========================================

// Renderizado de vistas SSR con motor de plantillas EJS
app.get('/', (req, res) => {
  const people = [
    { name: 'Jhon' },
    { name: 'Jose' },
    { name: 'Cameron' }
  ];
  res.render('index.ejs', { people });
});

// Middleware específico para el prefijo /user
app.all('/user', (req, res, next) => {
  console.log('[USER ROUTE] Interceptor ejecutado antes del manejador final');
  next();
});

// Consulta de recursos (GET)
app.get('/user', (req, res) => {
  res.json({
    status: 'success',
    data: {
      username: 'UsuarioDemo',
      role: 'admin'
    }
  });
});

// Creación o mutación con parámetros de ruta y body (POST)
app.post('/user/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body;

  res.json({
    message: `Usuario con ID ${id} procesado exitosamente`,
    payload: body
  });
});

// Actualización de recurso (PUT)
app.put('/contact', (req, res) => {
  res.send('PUT /contact recibido correctamente');
});

// Eliminación de recurso (DELETE)
app.delete('/test', (req, res) => {
  res.send('DELETE /test recibido correctamente');
});

// ==========================================
// 4. Inicialización del Servidor
// ==========================================
const PORT = app.get('port');
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 ${app.get('appName')}`);
  console.log(`📡 Servidor escuchando en http://localhost:${PORT}`);
  console.log(`========================================`);
});
