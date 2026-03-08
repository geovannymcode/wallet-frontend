# 💳 Wallet Pay — Billetera Digital

Aplicación de billetera digital construida con **Hilla (Vaadin + React)** en el frontend y un backend **NestJS** con arquitectura **CQRS + Event Sourcing**.

La interfaz simula una billetera tipo fintech (estilo Nequi, DaviPlata) con un diseño oscuro, moderno y mobile-first.

---

## 📸 Vista General

La aplicación tiene 4 secciones principales accesibles desde la barra de navegación inferior:

| Sección | Descripción |
|---------|-------------|
| 🏠 **Inicio** | Dashboard con tarjeta de billetera, configuración de wallet ID y últimos movimientos |
| 📤 **Enviar** | Flujo de transferencia en 3 pasos: formulario → confirmación → éxito |
| 📋 **Movimientos** | Lista de transacciones con filtros, detalle expandible y acciones (cancelar/reembolsar) |
| 📜 **Historial** | Timeline visual del Event Store con todos los eventos de una billetera |

---

## 🛠️ Tecnologías

### Frontend
- **Hilla 25** (framework de Vaadin con React)
- **React 19** con TypeScript
- **Vite** como bundler
- **Spring Boot** como servidor (sirve el frontend)

### Backend (externo)
- **NestJS** con arquitectura CQRS + Event Sourcing
- API REST corriendo en `http://localhost:3000`

---

## 🚀 Requisitos Previos

1. **Java 17+** — para ejecutar Spring Boot / Hilla
2. **Node.js 18+** — para compilar el frontend
3. **Backend NestJS** corriendo en `http://localhost:3000`

---

## ▶️ Cómo Ejecutar

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd wallet-frontend
```

### 2. Asegurarse de que el backend esté corriendo

El backend NestJS debe estar en `http://localhost:3000`. La app mostrará un indicador **"Online"** (verde) u **"Offline"** (rojo) en el header según el estado de la conexión.

### 3. Iniciar la aplicación

**Mac / Linux:**
```bash
./mvnw
```

**Windows:**
```bash
mvnw
```

Esto arranca Spring Boot con Hilla. Una vez iniciado, abre tu navegador en:

```
http://localhost:8080
```

---

## 📦 Endpoints del Backend Consumidos

La aplicación consume los siguientes endpoints de la API NestJS:

| Método | Endpoint | Uso en la App |
|--------|----------|---------------|
| `GET` | `/payments/health` | Verificar conexión (indicador Online/Offline) |
| `POST` | `/payments` | Enviar una transferencia (página Enviar) |
| `POST` | `/payments/:id/cancel` | Cancelar un pago (página Movimientos) |
| `POST` | `/payments/:id/refund` | Solicitar reembolso (página Movimientos) |
| `GET` | `/payments` | Listar pagos con filtros (páginas Inicio y Movimientos) |
| `GET` | `/payments/:id` | Obtener detalle de un pago (página Movimientos) |
| `GET` | `/payments/history/:walletId` | Historial de eventos (página Historial) |

### Ejemplos de Body

**Procesar Pago (`POST /payments`):**
```json
{
  "walletId": "WAL-001",
  "amount": 100,
  "currency": "USD",
  "recipientWalletId": "WAL-002",
  "concept": "Pago de prueba"
}
```

**Cancelar Pago (`POST /payments/:id/cancel`):**
```json
{
  "reason": "Pago duplicado"
}
```

**Reembolsar Pago (`POST /payments/:id/refund`):**
```json
{
  "reason": "Solicitud del cliente"
}
```

---

## 📁 Estructura del Proyecto

```
wallet-frontend/
├── src/
│   ├── main/
│   │   ├── frontend/                  # Código del frontend (React + TypeScript)
│   │   │   ├── index.html             # Template HTML principal
│   │   │   └── views/
│   │   │       ├── @index.tsx         # Componente principal — toda la app de billetera
│   │   │       └── @layout.tsx        # Layout simplificado (solo renderiza el Outlet)
│   │   └── java/                      # Código del servidor Spring Boot
│   │       └── Application.java       # Punto de entrada del servidor
├── package.json                       # Dependencias de Node.js
├── pom.xml                            # Dependencias de Maven / Spring Boot
├── vite.config.ts                     # Configuración de Vite
└── README.md                          # Este archivo
```

### Archivo principal: `@index.tsx`

Este archivo contiene **toda la lógica del frontend** en un solo componente autocontenido:

- **`api`** — Servicio que consume los endpoints del backend NestJS
- **`WalletHero`** — Tarjeta hero con gradiente que muestra el wallet ID
- **`InicioPage`** — Dashboard con configuración y últimos movimientos
- **`EnviarPage`** — Flujo de transferencia (formulario → confirmar → éxito)
- **`MovimientosPage`** — Lista de transacciones con filtros y acciones
- **`HistorialPage`** — Timeline visual del Event Store
- **`WalletCQRSApp`** — Componente raíz que maneja el estado global y la navegación

---

## 🏗️ Compilar para Producción

**Mac / Linux:**
```bash
./mvnw clean package -Pproduction
```

**Windows:**
```bash
mvnw clean package -Pproduction
```

Esto genera un archivo `.jar` en la carpeta `target/` con el frontend y backend empaquetados. Para ejecutarlo:

```bash
java -jar target/wallet-frontend-1.0-SNAPSHOT.jar
```

---

## ⚙️ Configuración

### Cambiar la URL del Backend

Si tu backend NestJS no está en `http://localhost:3000`, edita la constante `API_BASE` en el archivo:

```
src/main/frontend/views/@index.tsx
```

```typescript
const API_BASE = "http://localhost:3000"; // ← Cambia esta URL
```

---

## 🎨 Diseño

- **Tema oscuro** con paleta de colores purple/violet
- **Mobile-first** (max-width 480px centrado)
- **Navegación inferior** fija tipo app nativa
- **Glass morphism** en header y bottom nav con backdrop blur
- **Animaciones** sutiles (fadeUp, pulse)
- **Fuentes**: Inter (UI) + JetBrains Mono (datos técnicos)
- **Todo en español**

---

## 📚 Enlaces Útiles

- [Documentación de Hilla](https://hilla.dev/docs/)
- [Documentación de NestJS CQRS](https://docs.nestjs.com/recipes/cqrs)
- [Vaadin Forum](https://vaadin.com/forum)
- [Stack Overflow — Vaadin](https://stackoverflow.com/questions/tagged/vaadin)
