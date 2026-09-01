# ShipNow API

API RESTful desarrollada con Express.js y MongoDB para gestionar productos, usuarios, tiendas y órdenes de envío. El proyecto incluye un módulo de mocks para desarrollo que permite generar datos de prueba de forma rápida y consistente.

---

## Índice

- [ShipNow API](#shipnow-api)
  - [Índice](#índice)
  - [📋 Requisitos previos](#-requisitos-previos)
  - [🚀 Instalación y ejecución local](#-instalación-y-ejecución-local)
    - [1. Clonar el repositorio](#1-clonar-el-repositorio)
    - [2. Instalar dependencias](#2-instalar-dependencias)
    - [3. Configurar variables de entorno](#3-configurar-variables-de-entorno)
    - [4. Ejecutar el servidor](#4-ejecutar-el-servidor)
  - [✅ Verificar funcionamiento](#-verificar-funcionamiento)
  - [🧪 Testing funcional](#-testing-funcional)
  - [📎 Carga de archivos](#-carga-de-archivos)
  - [🐳 Producción y Docker](#-producción-y-docker)
  - [📝 Documentación con Swagger](#-documentación-con-swagger)
  - [🏗️ Arquitectura en capas](#️-arquitectura-en-capas)
  - [🔌 Endpoints principales](#-endpoints-principales)
    - [Usuarios](#usuarios)
    - [Tiendas](#tiendas)
    - [Productos](#productos)
    - [Órdenes](#órdenes)
  - [🧪 Mocks para desarrollo](#-mocks-para-desarrollo)
    - [Endpoints de mocks](#endpoints-de-mocks)
    - [Qué hacen los mocks](#qué-hacen-los-mocks)
  - [🔐 Seguridad y validaciones](#-seguridad-y-validaciones)
  - [📦 Dependencias principales](#-dependencias-principales)
  - [📝 Logging y monitoreo básico](#-logging-y-monitoreo-básico)
    - [Endpoint de prueba del logger](#endpoint-de-prueba-del-logger)
  - [👤 Autor](#-autor)

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
  
--

Ejemplo de variables:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/shipnow
NODE_ENV=development
LOG_LEVEL=debug
```

> El proyecto carga el archivo correcto según `NODE_ENV` mediante la configuración ubicada en `src/config` y valida los valores antes de iniciar.

### 4. Ejecutar el servidor

```bash
npm run dev
```

```bash
npm run test
```

El servidor quedará disponible en:

```text
http://localhost:3001/api
```

---

## ✅ Verificar funcionamiento

```bash
curl http://localhost:3001/api/
```

Respuesta esperada:

```json
{
    "status": "success",
    "message": "ShipNow API está corriendo y lista para recibir peticiones",
    "environment": "development",
    "port": "3001",
    "url": "http://localhost:3001/api"
}
```

También podés verificar la salud del servidor:

```bash
curl http://localhost:3001/api/health
```

---

## 🧪 Testing funcional

El proyecto utiliza testing funcional con:

- Mocha (runner de tests)
- Chai (assertions)
- Supertest (requests HTTP sobre la app Express)

### Ejecución

```bash
npm run test
```

Script configurado en [package.json](package.json):

```json
"test": "cross-env NODE_ENV=test MONGODB_URI=mongodb://localhost:27018/shipnow_test mocha --file tests/setup.js \"tests/**/*.test.js\" --timeout 100000 --exit"
```

### Entorno de testing y variables

- `NODE_ENV=test`
- `MONGODB_URI=mongodb://localhost:27018/shipnow_test`

El proyecto también soporta `.env.test` por el loader de entorno en `src/config`.

### Base de datos de testing

- Se usa una base separada de desarrollo (`shipnow_test` en el puerto 27018).
- La limpieza de datos se realiza en cada test mediante [tests/setup.js](tests/setup.js):
  - conexión antes de ejecutar
  - `deleteMany({})` por colección en `beforeEach`
  - cierre de conexión al finalizar

### Módulos cubiertos

- Soporte y salud: `api root`, `health`, `swagger`, ruta inexistente
- Users: listado, creación, validaciones, update, delete
- Stores: listado, creación, validaciones, update, delete
- Products: listado, creación, validaciones, update, delete
- Orders: listado, creación, validaciones de negocio, update de estado/prioridad, delete
- Mocks: endpoints de generación/listado y validaciones de `quantity`/body
- Logger: endpoint de prueba del logger
- Uploads: documentos de usuario y comprobantes de pedidos

---

## 📎 Carga de archivos

La carga de archivos usa Multer con configuración centralizada en `src/middlewares/upload.middleware.js`.

- Tipos permitidos: PDF, JPG y PNG.
- Tamaño máximo: 5 MB por archivo.
- Los archivos se guardan fuera de Git en `uploads/`.
- MongoDB guarda únicamente metadatos: nombre original, nombre generado, ruta, tipo MIME, tamaño y fecha de carga.

### Documento de usuario

```text
POST /api/users/:uid/documents
```

Enviar como `multipart/form-data`:

- `document`: archivo PDF, JPG o PNG.
- `documentType`: `DNI`, `CUIT`, `CUIL` o `PASSPORT`.

### Comprobante de pedido

```text
POST /api/orders/:oid/proof
```

Enviar como `multipart/form-data`:

- `proof`: archivo PDF, JPG o PNG.

Los errores de archivo usan el formato común de la API: `FILE_REQUIRED`, `INVALID_FILE_TYPE`, `FILE_TOO_LARGE`, `INVALID_DOCUMENT_TYPE` y `FILE_SAVE_ERROR`.

---

## 🐳 Producción y Docker

### Variables de entorno

La API valida al iniciar que existan `PORT`, `MONGODB_URI` y `NODE_ENV`. El nivel de logs se configura con `LOG_LEVEL`; si no se especifica, usa `debug` en desarrollo e `info` en test o producción.

Variables disponibles:

```env
PORT=3001
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/shipnow
NODE_ENV=production
LOG_LEVEL=info
JWT_SECRET=un-secreto-largo-y-aleatorio
```

Los entornos admitidos son `development`, `test` y `production`. Para producción se puede crear un archivo local `.env.prod`; no debe subirse al repositorio. `JWT_SECRET` queda documentado para una futura implementación de autenticación JWT, pero actualmente no es requerido por la API.

### Endpoints internos

- Los endpoints de mocks y `loggerTest` se montan solamente fuera de producción.
- Swagger permanece habilitado en `/api/docs/` para consultar el contrato de la API.
- El health check público está disponible en `/api/health` y devuelve únicamente `status`, `environment`, `uptime` y `timestamp`.

### Docker

Construir la imagen desde la raíz del proyecto:

```bash
docker build -t shipnow-api .
```

Ejecutar el contenedor pasando las variables desde un archivo externo:

```bash
docker run --env-file .env.prod -p 3001:3001 shipnow-api
```

La API quedará disponible en el puerto `3001`:

```text
http://localhost:3001/api/health
http://localhost:3001/api/docs/
```

Dentro de Docker, `localhost` apunta al propio contenedor. Para MongoDB Atlas usá la URI `mongodb+srv` correspondiente; para una base externa o en otro contenedor, configurá `MONGODB_URI` con el host alcanzable desde el contenedor.

`.dockerignore` evita que la imagen copie `node_modules`, archivos `.env`, `.git`, logs, uploads, coverage y archivos temporales. Los logs se generan en `logs/` y los archivos cargados en `uploads/`; ambas carpetas están excluidas de Git.

---

## 📝 Documentación con Swagger

La API está documentada con Swagger y expondrá una interfaz interactiva en:

```text
http://localhost:3001/api/docs/
```

En Swagger vas a encontrar los módulos documentados:

- Users
- Products
- Stores
- Orders
- Mocks
- Logger

Desde esa ruta podés abrir la documentación, revisar cada endpoint y probar las peticiones directamente.

--

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

--

## 👤 Autor

Cantarini Sol - [GitHub](https://github.com/cantariniSol)
