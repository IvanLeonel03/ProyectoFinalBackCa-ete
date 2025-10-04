# 🛒 Ecommerce - Proyecto Final

## 📋 Descripción del Proyecto
Este es un sistema de **ecommerce completo** desarrollado con **Node.js, Express, MongoDB y Handlebars**.  
El proyecto implementa todas las funcionalidades requeridas para la **gestión profesional de productos y carritos de compra**.

---

## ✅ Objetivos Cumplidos

### 🎯 Objetivos Generales
- ✅ MongoDB como sistema de persistencia principal  
- ✅ Todos los endpoints definidos para productos y carritos  

### 🎯 Objetivos Específicos
- ✅ Consultas profesionalizadas de productos con filtros, paginación y ordenamiento  
- ✅ Gestión profesional de carritos implementando los últimos conceptos vistos  

---

## 🚀 Funcionalidades Implementadas

### 📦 Sistema de Productos

#### Consultas Profesionalizadas
El endpoint `GET /api/products` acepta los siguientes parámetros:

- **limit** (opcional): Número de productos por página (default: 10)  
- **page** (opcional): Página a mostrar (default: 1)  
- **query** (opcional): Filtro por categoría o disponibilidad  
- **sort** (opcional): Ordenamiento por precio (`asc` | `desc`)  

#### Ejemplos de Uso
```http
# Todos los productos con paginación
/api/products

# Filtrado por categoría
/api/products?category=electronics

# Solo productos disponibles
/api/products?available=true

# Ordenamiento por precio
/api/products?sort=asc
/api/products?sort=desc

# Combinación de filtros
/api/products?category=electronics&sort=desc&limit=5&page=2


Estructura de Respuesta
{
  "status": "success",
  "payload": [...],
  "totalPages": 3,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "..."
}


🛒 Sistema de Carritos
Endpoints Implementados

DELETE /api/carts/:cid/products/:pid → Elimina un producto específico del carrito

PUT /api/carts/:cid → Actualiza todos los productos del carrito con un arreglo nuevo

PUT /api/carts/:cid/products/:pid → Actualiza SOLO la cantidad de un producto específico

DELETE /api/carts/:cid → Elimina todos los productos del carrito

GET /api/carts/:cid → Obtiene el carrito con populate de productos

Características del Carrito

✅ Referencias a productos usando el modelo Products

✅ Populate automático para obtener datos completos de productos

✅ Gestión completa de cantidades y eliminación

🖥️ Vistas Implementadas
📄 Página de Productos (/products)

✅ Visualización de todos los productos con paginación

✅ Filtros interactivos en la interfaz

✅ Dos opciones por producto:

Ver detalles (/products/:pid)

Agregar al carrito directamente

📄 Vista de Detalle de Producto (/products/:pid)

✅ Descripción completa del producto

✅ Detalles de precio, categoría y stock

✅ Botón para agregar al carrito

📄 Vista del Carrito (/carts/:cid)

✅ Lista SOLO de los productos del carrito específico

✅ Gestión de cantidades (aumentar/disminuir)

✅ Eliminación individual de productos

✅ Cálculo de totales automático

✅ Vaciar carrito completo

🛠️ Tecnologías Utilizadas

Backend: Node.js + Express.js

Base de Datos: MongoDB + Mongoose

Templating: Handlebars

Frontend: CSS3 + JavaScript vanilla

Paginación: Mongoose Paginate v2

📦 Instalación y Uso
🔹 Prerrequisitos

Tener instalado Node.js

Tener instalado MongoDB

🔹 Instalación
# 1. Clonar el proyecto
git clone <repositorio>

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env con:
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=8080

# 4. Poblar base de datos (opcional)
npm run test

# 5. Ejecutar en modo desarrollo
npm run dev

🔹 URLs Principales

Productos (vista): http://localhost:8080/products

API Products: http://localhost:8080/api/products

Carrito: http://localhost:8080/carts/:cartId

Health Check: http://localhost:8080/health


📁 Estructura del Proyecto
src/
├── models/
│   ├── Product.js              # Modelo con paginación y filtros
│   └── Cart.js                 # Modelo con referencia a productos
├── routes/
│   ├── api/
│   │   ├── products.routes.js  # Endpoints con filtros profesionalizados
│   │   └── carts.routes.js     # Endpoints completos de carritos
│   └── views.routes.js         # Vistas con Handlebars
└── views/
    ├── products.handlebars      # Lista con paginación
    ├── productDetail.handlebars # Detalle de producto
    └── cart.handlebars          # Vista específica de carrito

✅ Verificación de Requisitos
🔹 Consultas de Productos Profesionalizadas

Filtros por query params

Paginación con limit y page

Ordenamiento por precio (asc/desc)

Búsqueda por categoría y disponibilidad

Estructura de respuesta estandarizada

🔹 Gestión Completa de Carritos

Eliminar producto específico

Actualizar carrito completo

Actualizar cantidad de producto

Vaciar carrito

Populate de productos

🔹 Vistas Profesionales

Lista de productos con paginación

Vista de detalle de producto

Vista específica de carrito

Botones de agregar al carrito

🎯 Características Destacadas

Arquitectura escalable y mantenible

Código profesional con separación de concerns

Interfaz responsive y amigable

Manejo de errores robusto

Validaciones de datos completas