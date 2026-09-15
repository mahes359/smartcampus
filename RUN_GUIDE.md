# SmartCampus – Complete Execution & Startup Guide

This document outlines how to run the entire **SmartCampus** application (Multi-Tenant PostgreSQL, Spring Boot microservices, and React/Vite frontend).

---

## 1. Quickest Method: Docker (Recommended)

With Docker, you do **not** need to install or configure PostgreSQL, pgAdmin, Java, or Maven manually. All services and databases are containerized and auto-initialized.

### Launch with One Command

Open a PowerShell terminal in the project root:

```powershell
# Option 1: Core Stack (PostgreSQL + Eureka + API Gateway + Auth + College + Frontend)
.\docker-start.ps1 -Core

# Option 2: Full Campus Stack (PostgreSQL + All 22 Microservices + Frontend)
.\docker-start.ps1 -All

# Option 3: Core Stack + pgAdmin 4 Web GUI
.\docker-start.ps1 -Core -Tools
```

Or run Docker Compose directly:
```powershell
# Core Stack
docker compose --profile core up -d

# Full Stack
docker compose --profile all up -d
```

### Stop Containers
```powershell
.\docker-stop.ps1
# Or: docker compose --profile all --profile core --profile tools down
```
> [!NOTE]
> All database data is preserved safely in the Docker named volume `smartcampus_postgres_data`.

---

## 2. Alternative Method: Local PowerShell Scripts

If you wish to run without Docker, using your locally installed JDK 21, Maven, Node.js, and local PostgreSQL 18:

### Step 1: Initialize Local Database
Ensure PostgreSQL is active on port `5432` with username `postgres`.  
Execute the script [`backend/docker/init-databases.sql`](backend/docker/init-databases.sql) once in pgAdmin or via `psql`.

### Step 2: Start Backend Microservices
```powershell
# Option 1: Start Core Infrastructure (Eureka + Gateway + Auth + College)
.\start-backend.ps1 -Core

# Option 2: Start ALL 22 microservices
.\start-backend.ps1 -All
```

### Step 3: Start Frontend Web Application
In a separate terminal:
```powershell
.\start-frontend.ps1
```

### Step 4: Stop Local Services
```powershell
.\stop-all.ps1
```

---

## 3. Web Access & Port Reference Map

| Component / Microservice | Local Port | Key URL / Endpoint |
| :--- | :--- | :--- |
| **Frontend Web App** | `5173` | [http://localhost:5173/](http://localhost:5173/) |
| **API Gateway** | `8080` | [http://localhost:8080/](http://localhost:8080/) |
| **Eureka Service Registry** | `8761` | [http://localhost:8761/](http://localhost:8761/) |
| **PostgreSQL Database** | `5432` | `localhost:5432` (Auto-initialized) |
| **pgAdmin 4 (Optional)** | `5050` | [http://localhost:5050/](http://localhost:5050/) |
| **auth-service** | `8090` | `/api/auth/status` |
| **college-service** | `8091` | `/api/colleges` |
| **student-service** | `8092` | `/api/students` |
| **faculty-service** | `8093` | `/api/faculty` |
| **course-service** | `8094` | `/api/courses` |
| **enrollment-service** | `8095` | `/api/enrollments` |
| **attendance-service** | `8096` | `/api/attendance` |
| **exam-service** | `8097` | `/api/exams` |
| **timetable-service** | `8098` | `/api/timetable` |
| **fee-service** | `8099` | `/api/fees` |
| **library-service** | `8100` | `/api/library` |
| **hostel-service** | `8101` | `/api/hostel` |
| **transport-service** | `8102` | `/api/transport` |
| **leave-service** | `8103` | `/api/leaves` |
| **placement-service** | `8104` | `/api/placements` |
| **event-service** | `8105` | `/api/events` |
| **notification-service** | `8106` | `/api/notifications` |
| **document-service** | `8107` | `/api/documents` |
| **helpdesk-service** | `8108` | `/api/helpdesk` |
| **report-service** | `8109` | `/api/reports` |

---

## 4. Default Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@smartcampus.edu` | `password123` |
| **College Admin** | `admin@smartcampus.edu` | `password123` |
| **Faculty** | `faculty@smartcampus.edu` | `password123` |
| **Student** | `student@smartcampus.edu` | `password123` |
