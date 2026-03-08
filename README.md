# 💳 Wallet Pay — Billetera Digital

Aplicación de billetera digital construida con **Hilla (Vaadin + React)** en el frontend y un backend **NestJS** con arquitectura **CQRS + Event Sourcing**.

Interfaz fintech moderna con tema oscuro, glass morphism y diseño mobile-first — estilo Nequi / DaviPlata.

---

## 📸 Funcionalidades

### Navegación Principal (barra inferior)

| Tab | Página | Descripción |
|-----|--------|-------------|
| 🏠 | **Inicio** | Tarjeta hero con datos de la billetera, selector de wallet, acciones rápidas y últimos movimientos |
| 📤 | **Enviar** | Flujo de transferencia en 3 pasos (formulario → confirmación → comprobante) |
| 📋 | **Movimientos** | Lista de transacciones con filtros por estado y detalle visual al hacer clic |
| 📜 | **Historial** | Timeline del Event Store con todos los eventos de una billetera |

### Accesos desde Inicio (acciones rápidas)

| Acción | Descripción |
|--------|-------------|
| 🚫 **Cancelar Pago** | Cancela un pago ingresando el Payment ID y el motivo |
| ↩️ **Reembolsar** | Solicita reembolso ingresando el Payment ID y el motivo |

---

## 🛠️ Tecnologías

### Frontend
- **Hilla 25** (Vaadin + React)
- **React 19** con TypeScript
- **Vite** como bundler
- **Spring Boot 4** como servidor

### Backend (externo)
- **NestJS** con CQRS + Event Sourcing
- API REST en `http://localhost:3000`

---

## 🚀 Requisitos Previos

- **Java 21+**
- **Node.js 18+**
- **Backend NestJS** corriendo en `http://localhost:3000`

---

## ▶️ Cómo Ejecutar

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd wallet-frontend
```

### 2. Iniciar el backend

El backend NestJS debe estar en `http://localhost:3000`. El header muestra un indicador **"Online"** (verde) u **"Offline"** (rojo).

### 3. Iniciar la aplicación

```bash
# Mac / Linux
./mvnw

# Windows
mvnw
```

Abre el navegador en: **http://localhost:8080**

---

## 📦 Endpoints Consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/wallets` | Lista de billeteras con nombre del propietario |
| `GET` | `/payments/health` | Estado de la API (Online/Offline) |
| `POST` | `/payments` | Procesar una transferencia |
| `POST` | `/payments/:id/cancel` | Cancelar un pago |
| `POST` | `/payments/:id/refund` | Reembolsar un pago |
| `GET` | `/payments` | Listar pagos con filtros (walletId, status, page, limit) |
| `GET` | `/payments/:id` | Detalle de un pago |
| `GET` | `/payments/history/:walletId` | Historial de eventos (Event Store) |

### Respuesta esperada de `GET /wallets`

```json
[
  { "walletId": "WAL-001", "ownerName": "Geovanny Mendoza", "currency": "USD" },
  { "walletId": "WAL-002", "ownerName": "Luis Porras", "currency": "USD" }
]
```

### Ejemplos de Body

**Procesar Pago:**
```json
{
  "walletId": "WAL-001",
  "amount": 100,
  "currency": "USD",
  "recipientWalletId": "WAL-002",
  "concept": "Pago de prueba"
}
```

**Cancelar / Reembolsar:**
```json
{
  "reason": "Pago duplicado"
}
```

---

## 📁 Estructura del Proyecto

```
wallet-frontend/
├── src/main/
│   ├── frontend/
│   │   ├── config/
│   │   │   └── api.config.ts             # URL base del backend
│   │   ├── types/
│   │   │   └── wallet.types.ts            # Interfaces (Wallet, ToastState)
│   │   ├── services/
│   │   │   └── api.service.ts             # Servicio HTTP — consume todos los endpoints
│   │   ├── styles/
│   │   │   └── global.styles.ts           # CSS global, variables y estilos compartidos
│   │   ├── components/
│   │   │   ├── ActionButton.tsx           # Botón con variantes (primary/danger/ghost)
│   │   │   ├── Card.tsx                   # Contenedor con bordes y glass morphism
│   │   │   ├── StatusPill.tsx             # Badge de estado (Completado/Cancelado/Reembolsado)
│   │   │   ├── Toast.tsx                  # Notificaciones flotantes
│   │   │   ├── WalletHero.tsx             # Tarjeta hero con gradiente y datos de wallet
│   │   │   └── WalletSelect.tsx           # Combobox reutilizable para selección de billetera
│   │   ├── pages/
│   │   │   ├── InicioPage.tsx             # Dashboard principal con acciones rápidas
│   │   │   ├── EnviarPage.tsx             # Flujo de transferencia (3 pasos)
│   │   │   ├── CancelarPage.tsx           # Cancelar pago (ID + motivo)
│   │   │   ├── ReembolsarPage.tsx         # Reembolsar pago (ID + motivo)
│   │   │   ├── MovimientosPage.tsx        # Lista de transacciones con filtros y detalle
│   │   │   └── HistorialPage.tsx          # Timeline del Event Store
│   │   ├── views/
│   │   │   ├── @index.tsx                 # Orquestador principal (~135 líneas)
│   │   │   └── @layout.tsx                # Layout (Suspense + Outlet)
│   │   ├── themes/wallet-frontend/
│   │   │   ├── styles.css                 # Estilos Vaadin
│   │   │   └── theme.json                 # Configuración del tema Lumo
│   │   └── index.html                     # HTML base
│   ├── java/com/geovannycode/wallet/
│   │   └── Application.java              # Punto de entrada Spring Boot
│   └── resources/
│       └── application.properties         # Configuración del servidor
├── package.json
├── pom.xml
└── README.md
```

---

## 🏗️ Compilar para Producción

```bash
# Mac / Linux
./mvnw clean package -Pproduction

# Windows
mvnw clean package -Pproduction
```

Ejecutar el JAR generado:

```bash
java -jar target/wallet-frontend-1.0-SNAPSHOT.jar
```

---

## ⚙️ Configuración

### Cambiar la URL del Backend

Editar `src/main/frontend/config/api.config.ts`:

```typescript
export const API_BASE = "http://localhost:3000"; // ← Cambia esta URL
```

### Paquete Java

El paquete base es `com.geovannycode.wallet`, configurado en:
- `pom.xml` → `<groupId>`
- `application.properties` → `vaadin.allowed-packages`

---

## 🎨 Diseño

- **Tema oscuro** — paleta purple/violet con glassmorphism
- **Mobile-first** — max-width 520px centrado
- **Navegación inferior** — 4 tabs fijos tipo app nativa
- **Backdrop blur** — en header y bottom nav
- **Animaciones** — fadeUp, pulse
- **Fuentes** — Inter (UI) + JetBrains Mono (datos técnicos)
- **Idioma** — toda la interfaz en español

---

## 👤 Autor

**Geovanny Mendoza** — [@geovannycode](https://github.com/geovannycode)

---

## 📚 Enlaces Útiles

- [Hilla](https://hilla.dev/docs/)
- [NestJS CQRS](https://docs.nestjs.com/recipes/cqrs)
- [Vaadin Forum](https://vaadin.com/forum)
