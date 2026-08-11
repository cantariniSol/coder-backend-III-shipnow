# ShipNow API

API RESTful desarrollada con Express.js y MongoDB para gestionar productos, usuarios, tiendas y órdenes de envío. El proyecto incluye un módulo de mocks para desarrollo que permite generar datos de prueba de forma rápida y consistente.

---

## 📋 Requisitos previos

- Node.js 18+
- npm o yarn
- MongoDB local o en la nube
- Git

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

Crea los archivos de entorno según el ambiente que quieras usar:

- `.env.dev` para desarrollo
- `.env.test` para testing


Ejemplo de variables:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/shipnow
NODE_ENV=development
```

> El proyecto carga el archivo correcto según `NODE_ENV` mediante la configuración ubicada en `src/config` y valida los valores antes de iniciar.

### 4. Ejecutar el servidor

```bash
npm run dev
```

```bash
npm run stg
```

```bash
npm run prod
```

El servidor quedará disponible en:

```text
http://localhost:3001
```

---

## ✅ Verificar funcionamiento

```bash
curl http://localhost:3001/
```

Respuesta esperada:

```json
{
  "status": "success",
  "message": "ShipNow API está corriendo y lista para recibir peticiones"
}
```

También podés verificar la salud del servidor:

```bash
curl http://localhost:30001/health
```

---

## � Documentación con Swagger

La API está documentada con Swagger y expondrá una interfaz interactiva en:

```text
http://localhost:30001/api/docs
```

En Swagger vas a encontrar los módulos documentados:

- Users
- Products
- Stores
- Orders
- Mocks
- Logger

Desde esa ruta podés abrir la documentación, revisar cada endpoint y probar las peticiones directamente.

---

## �📁 Estructura del proyecto

```text
src/
├── app.js
├── config/
│   ├── db.js
│   ├── env.loader.js
│   ├── env.validate.js
│   └── index.js
├── constants/
│   └── index.js
├── controllers/
│   ├── users.controller.js
│   ├── stores.controller.js
│   ├── products.controller.js
│   ├── orders.controller.js
│   └── mocks/
│       ├── users.mocks.controller.js
│       ├── stores.mocks.controller.js
│       ├── products.mocks.controller.js
│       └── orders.mocks.controller.js
├── errors/
│   ├── AppError.js
│   ├── createError.js
│   ├── errors.dictionary.js
│   └── index.js
├── middlewares/
│   └── errorHandler.js
├── models/
│   ├── users.model.js
│   ├── stores.model.js
│   ├── products.model.js
│   └── orders.model.js
├── mocks/
│   ├── users.mocks.js
│   ├── stores.mocks.js
│   ├── products.mocks.js
│   ├── orders.mocks.js
├── repositories/
│   ├── users.repository.js
│   ├── stores.repository.js
│   ├── products.repository.js
│   └── orders.repository.js
├── responses/
│   └── apiResponse.js
├── services/
│   ├── users.service.js
│   ├── stores.service.js
│   ├── products.service.js
│   ├── orders.service.js
│   └── mocks/
│       ├── users.mocks.service.js
│       ├── stores.mocks.service.js
│       ├── products.mocks.service.js
│       └── orders.mocks.service.js
├── routes/
│   ├── users.routes.js
│   ├── stores.router.js
│   ├── products.routes.js
│   ├── orders.router.js
│   └── mocks.router.js
└── utils/
    ├── mocks.validate.js
    └── logger.js
````

---

## 🏗️ Arquitectura en capas

La aplicación sigue una arquitectura modular basada en capas:

- Controllers: reciben los requests HTTP y responden con JSON
- Services: contienen la lógica de negocio, validaciones y reglas de dominio
- Repositories: encapsulan el acceso a MongoDB
- Models: definen los esquemas y validaciones de Mongoose
- Middlewares: gestionan el flujo y el manejo global de errores
- Utils: contiene herramientas transversales como el logger centralizado

La separación en capas permite mantener el código más claro, escalable y fácil de probar. El logger centralizado evita `console.log` dispersos y facilita la observabilidad del servidor.

---

## 📝 Logging y monitoreo básico

ShipNow usa `winston` como logger centralizado. El sistema registra eventos importantes en distintos niveles:

- `debug`
- `http`
- `info`
- `warning`
- `error`
- `fatal`

Los logs se escriben en consola y en archivos rotados bajo `logs/`:

- `logs/application-YYYY-MM-DD.log` para `info` y niveles superiores
- `logs/error-YYYY-MM-DD.log` para `error` y `fatal`

El comportamiento cambia según el entorno:

- En desarrollo (`NODE_ENV=development`), se muestran logs desde `debug`.
- En producción (`NODE_ENV=production`), se registran solo niveles más relevantes como `info`, `warning`, `error` y `fatal`.

### Endpoint de prueba del logger

Para verificar la configuración del logger ejecuta:

```bash
curl -i http://localhost:3001/api/mocks/loggerTest
```

Esta ruta está disponible solo en entornos distintos a producción.

---

## 🔌 Endpoints principales

### Usuarios

```text
GET    /users
GET    /users/:uid
POST   /users
PUT    /users/:uid
DELETE /users/:uid
```

### Tiendas

```text
GET    /stores
GET    /stores/:sid
POST   /stores
PUT    /stores/:sid
DELETE /stores/:sid
```

### Productos

```text
GET    /products
GET    /products/:pid
POST   /products
PUT    /products/:pid
DELETE /products/:pid
```

### Órdenes

```text
GET    /orders
GET    /orders/:oid
POST   /orders
PUT    /orders/:oid
DELETE /orders/:oid
```

---

## 🧪 Mocks para desarrollo

El proyecto incorpora un módulo de mocks que solo está disponible en entornos distintos a producción.

### Endpoints de mocks

```text
GET    /mocks/mockingUsers
POST   /mocks/generateUsers

GET    /mocks/mockingStores
POST   /mocks/generateStores

GET    /mocks/mockingProducts
POST   /mocks/generateProducts

GET    /mocks/mockingOrders
POST   /mocks/generateOrders
```

### Qué hacen los mocks

- Generan usuarios con datos falsos y contraseñas seguras
- Generan tiendas vinculadas a usuarios existentes
- Generan productos con stock y categorías aleatorias
- Generan órdenes con cliente, tienda, productos y direcciones reales o simuladas
- Calculan el total de la orden y reducen el stock de los productos involucrados
- Validan la cantidad solicitada y solo funcionan en entornos de desarrollo

> El flujo de órdenes está pensado para usar productos reales, validar stock y evitar que este llegue a valores negativos.

---

## 🔐 Seguridad y validaciones

- Se usa `bcryptjs` para hashear contraseñas de usuarios mock
- La configuración valida `PORT`, `MONGODB_URI` y `NODE_ENV` antes de iniciar
- `db.js` comprueba la conexión a MongoDB y reporta fallos de conexión
- Hay middleware global de errores en `src/middlewares/errorHandler.js`
- Se validan roles, categorías y datos obligatorios en los servicios
- El stock de los productos se reduce solo si existe suficiente inventario
- Se evita crear órdenes con datos incompletos o inválidos

---

## 📦 Dependencias principales

```json
{
  "@faker-js/faker": "^10.5.0",
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.6",
  "cross-env": "^10.1.0",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "mongoose": "^9.7.2",
  "nodemon": "^3.1.14"
}
```

---

## 🛠️ Scripts disponibles

```bash
npm run dev
npm run test
```

---

## 👤 Autor

Cantarini Sol - [GitHub](https://github.com/cantariniSol)
