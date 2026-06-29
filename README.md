# ShipNow API

API RESTful desarrollada con Express.js y MongoDB para gestionar productos, usuarios, tiendas y órdenes de envío.

---

## 📋 Requisitos previos

- **Node.js** v18+
- **npm** o **yarn**
- **MongoDB** (local o en la nube, ej: MongoDB Atlas)
- **Git**

---

## 🚀 Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/cantariniSol/coder-backend-III-shipnow.git
cd coder-backend-III-shipnow
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
MONGO_URL=mongodb://localhost:27017/shipnow
# o usa MongoDB Atlas:
# MONGO_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/shipnow

# Puerto
PORT=8080

# Entorno
NODE_ENV=development
```

### 4. Ejecutar el servidor

**Desarrollo:**
```bash
npm run dev
```

**Staging:**
```bash
npm run stg
```

**Producción:**
```bash
npm run prod
```

El servidor estará disponible en `http://localhost:8080`

---

## ✅ Verificar que el servidor está funcionando

```bash
# Revisar estado del servidor
curl http://localhost:8080/
# Respuesta esperada:
# { "status": "success", "message": "ShipNow API funcionando correctamente" }
# -----------------------

curl http://localhost:3000/health
# Respuesta esperada:
# { "environment": "development", "port": "3000" }
```

---

## 📁 Estructura del proyecto

```
src/
├── app.js                 # Entrada principal
├── config/
│   ├── db.js             # Conexión a MongoDB
│   ├── env.loader.js     # Carga variables de entorno
│   ├── env.validate.js   # Valida variables requeridas
│   └── index.js          # Exporta configuración
├── constants/
│   └── index.js          # Constantes (roles, estados, categorías)
├── models/               # Esquemas de MongoDB
│   ├── products.model.js
│   ├── users.model.js
│   ├── stores.model.js
│   └── orders.model.js
├── repositories/         # Acceso a datos (queries)
│   ├── products.repository.js
│   ├── users.repository.js
│   ├── stores.repository.js
│   └── orders.repository.js
├── services/             # Lógica de negocio
│   ├── products.service.js
│   ├── users.service.js
│   ├── stores.service.js
│   └── orders.service.js
├── controllers/          # Manejo de requests/responses
│   ├── products.controller.js
│   ├── users.controller.js
│   ├── stores.controller.js
│   └── orders.controller.js
└── routes/               # Definición de rutas
    ├── products.routes.js
    ├── users.routes.js
    ├── stores.router.js
    └── orders.router.js
```

---

## 🏗️ Arquitectura en capas

La aplicación sigue una arquitectura de **capas separadas**:

- **Controllers**: Manejan requests HTTP y envían responses
- **Services**: Contienen la lógica de negocio y validaciones
- **Repositories**: Se encargan del acceso a datos (queries)
- **Models**: Definen los esquemas de la base de datos

### ¿Por qué separar Service y Repository?

**Repository maneja acceso a datos, Service maneja lógica de negocio; permite cambiar BD sin tocar reglas de negocio y facilita testing.**

---

## 🔌 Endpoints principales

### Productos
```
GET    /api/products         # Obtener todos los productos
GET    /api/products/:pid    # Obtener producto por ID
POST   /api/products         # Crear producto
PUT    /api/products/:pid    # Actualizar producto
DELETE /api/products/:pid    # Eliminar producto
```

### Usuarios
```
GET    /api/users            # Obtener todos los usuarios
GET    /api/users/:uid       # Obtener usuario por ID
POST   /api/users            # Crear usuario
PUT    /api/users/:uid       # Actualizar usuario
DELETE /api/users/:uid       # Eliminar usuario
```

### Tiendas
```
GET    /api/stores           # Obtener todas las tiendas
GET    /api/stores/:sid      # Obtener tienda por ID
POST   /api/stores           # Crear tienda
PUT    /api/stores/:sid      # Actualizar tienda
DELETE /api/stores/:sid      # Eliminar tienda
```

### Órdenes
```
GET    /api/orders           # Obtener todas las órdenes
GET    /api/orders/:oid      # Obtener orden por ID
POST   /api/orders           # Crear orden
PUT    /api/orders/:oid      # Actualizar estado de orden
DELETE /api/orders/:oid      # Eliminar orden
```

---

## 📦 Dependencias

```json
{
  "cors": "^2.8.6",              // Control de CORS
  "cross-env": "^10.1.0",        // Variables de entorno multiplataforma
  "dotenv": "^17.4.2",           // Cargar .env
  "express": "^5.2.1",           // Framework web
  "mongoose": "^9.7.2"           // ODM para MongoDB
}
```

---


## 🛠️ Desarrollo

### Scripts disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo
npm run stg      # Ejecutar en modo staging
npm run prod     # Ejecutar en modo producción
```

---




## 👤 Autor

Cantarini Sol - [GitHub](https://github.com/cantariniSol)