# Documentación de Base de Datos — ClientPulse SaaS (PostgreSQL 17)

Arquitectura relacional diseñada para soportar gestión de cuentas de clientes B2B, asignación de proyectos y emisión de facturas/invoices en modelo Single-Tenant.

---

## 📊 Diagrama Entidad-Relación (DER)

```mermaid
erDiagram
    USERS ||--o{ CLIENTS : "gestiona"
    CLIENTS ||--o{ PROJECTS : "posee"
    CLIENTS ||--o{ INVOICES : "recibe"

    USERS {
        varchar id PK
        varchar name
        varchar email UK
        varchar password_hash
        varchar company_name
        varchar avatar_url
        timestamp created_at
        timestamp updated_at
    }

    CLIENTS {
        varchar id PK
        varchar user_id FK
        varchar company_name
        varchar domain
        varchar contact_name
        varchar contact_email
        varchar phone
        enum status
        numeric mrr_amount
        numeric total_billed
        numeric unpaid_amount
        timestamp last_activity
        timestamp created_at
        timestamp updated_at
    }

    PROJECTS {
        varchar id PK
        varchar client_id FK
        varchar name
        numeric budget
        enum status
        date deadline
        timestamp created_at
        timestamp updated_at
    }

    INVOICES {
        varchar id PK
        varchar client_id FK
        varchar invoice_code UK
        numeric amount
        date due_date
        enum status
        timestamp paid_at
        timestamp created_at
        timestamp updated_at
    }
```

---

## 🗃️ Diccionario de Datos

| Tabla | Propósito | Llave Primaria | Relaciones / Restricciones |
| :--- | :--- | :--- | :--- |
| `users` | Cuentas administrativas del SaaS | `id` (VARCHAR) | `email` único |
| `clients` | Empresas y cuentas B2B | `id` (VARCHAR) | FK `user_id` -> `users.id` (ON DELETE CASCADE) |
| `projects` | Proyectos contratados y presupuestos | `id` (VARCHAR) | FK `client_id` -> `clients.id` (ON DELETE CASCADE) |
| `invoices` | Facturas emitidas y estado de cobro | `id` (VARCHAR) | FK `client_id` -> `clients.id`, `invoice_code` único |

---

## 🐳 Ejecución con Docker Compose

Para iniciar la base de datos PostgreSQL 17 en local:

```bash
docker compose up -d
```

Para aplicar las migraciones con Prisma 6:

```bash
npx prisma migrate dev --name init
```
