# SmartCampus – Production Deployment & Execution Guide

This document outlines how to deploy and operate the entire **SmartCampus** distributed system (PostgreSQL 16, 22 Spring Boot microservices, Eureka discovery, API Gateway, and React 19 / Nginx frontend) completely through Docker Compose on an Azure Linux VM or local workstation.

---

## 1. Quick Start: Production Docker Deployment (Azure Linux VM)

With Docker Compose, all 24 containers run within a private bridge network (`smartcampus-network`). PostgreSQL automatically initializes all 20 isolated microservice databases, Eureka coordinates discovery, API Gateway handles intelligent routing, and Nginx serves the React SPA while reverse-proxying `/api/*` requests.

### Prerequisites on Azure VM
- Ubuntu 22.04 / Debian 12 / RHEL 9 VM
- Docker Engine >= 24.0 and Docker Compose >= 2.20
- Git

### Step-by-Step Deployment Commands

```bash
# 1. Clone repository and checkout the extra branch
git clone -b extra https://github.com/mahes359/smartcampus.git
cd smartcampus

# 2. Setup environment variables from template
cp .env.example .env

# (Optional) Customize POSTGRES_PASSWORD or JWT_SECRET in .env if desired:
# nano .env

# 3. Build all container images (Frontend + 22 Microservices)
docker compose build

# 4. Start the entire SmartCampus stack in detached mode
docker compose up -d

# 5. Verify container status and health
docker compose ps
```

---

## 2. Essential Operations & Commands

### View Logs
```bash
# Stream logs for all containers
docker compose logs -f

# View logs for a specific service
docker compose logs -f api-gateway
docker compose logs -f eureka-server
docker compose logs -f postgres
docker compose logs -f frontend
```

### Stop the System
```bash
# Stop all containers (data in PostgreSQL volume is safely preserved)
docker compose down
```

### Rebuild After Code Updates
```bash
# Pull latest changes from git
git pull origin extra

# Rebuild and restart updated services with zero unnecessary downtime
docker compose up -d --build
```

### Reset PostgreSQL Volumes (Fresh Re-initialization Only)
> [!CAUTION]
> This command permanently destroys existing database data and causes PostgreSQL initialization scripts to run from scratch. Only use this when intentionally resetting the system.

```bash
# Stop containers and wipe the database named volume
docker compose down -v

# Start with a fresh volume and re-run init-databases.sql
docker compose up -d
```

---

## 3. Architecture & Network Topology

```
                   Internet / Web Browser
                             |
                             v  Port 80 (and 5173 for dev compatibility)
                      +--------------+
                      | Frontend     |  (React 19 + Nginx)
                      +--------------+
                             |
                             |  Internal Proxy: /api/* -> http://api-gateway:8080
                             v
                      +--------------+
                      | API Gateway  |  Port 8080
                      +--------------+
                             |
             +---------------+---------------+
             |                               |
             v                               v
      +--------------+               +--------------------------------------+
      | Eureka       |  Port 8761    | 20 Microservices (Ports 8090 - 8109) |
      | Registry     |               | (Internal network only - not public) |
      +--------------+               +--------------------------------------+
                                                     |
                                                     v
                                             +---------------+
                                             | PostgreSQL 16 |  Port 5432
                                             | (Multi-tenant)|  (Internal only)
                                             +---------------+
```

---

## 4. Port & External Access Reference

| Component / Service | Exposed Host Port | Publicly Accessible? | Description & URL |
| :--- | :--- | :--- | :--- |
| **Frontend (Nginx)** | `80`, `5173` | **Yes** | Web application UI (`http://<VM_IP>/`) |
| **API Gateway** | `8080` | **Yes (Optional)** | Central API router & health check (`http://<VM_IP>:8080/actuator/health`) |
| **Eureka Server** | `8761` | **Yes (Admin)** | Discovery Dashboard (`http://<VM_IP>:8761/`) |
| **PostgreSQL** | `5432` | **No** (Internal) | Isolated to `smartcampus-network` |
| **Microservices (20)**| `8090 - 8109` | **No** (Internal) | Internal Docker network communication only via `lb://<SERVICE_NAME>` |

---

## 5. Verification & Health Check Endpoints

Once `docker compose ps` shows services healthy, you can test endpoints from the host:

```bash
# 1. Frontend Web App
curl -I http://localhost/

# 2. API Gateway Actuator Health
curl http://localhost:8080/actuator/health

# 3. Eureka Registered Services
curl -H "Accept: application/json" http://localhost:8761/eureka/apps

# 4. Proxy through Frontend (Port 80) -> Gateway -> Microservice
curl http://localhost/api/colleges/status
curl http://localhost/api/students/status
curl http://localhost/api/courses/status
curl http://localhost/api/auth/status
curl http://localhost/api/reports/summary
```

---

## 6. Default Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@smartcampus.edu` | `password123` |
| **College Admin** | `admin@smartcampus.edu` | `password123` |
| **Faculty** | `faculty@smartcampus.edu` | `password123` |
| **Student** | `student@smartcampus.edu` | `password123` |
