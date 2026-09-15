# SmartCampus – Complete Execution & Startup Guide

This document outlines how to run the entire **SmartCampus** application (both Spring Boot backend microservices and the React/Vite frontend) on your local machine.

---

## 1. System Prerequisites

Before launching the project, ensure the following tools are installed and available in your `PATH`:

| Requirement | Verified Version on System | Purpose |
| :--- | :--- | :--- |
| **Java JDK** | JDK 21 (21.0.11+) | Compiles and executes Spring Boot services |
| **Apache Maven** | Maven 3.9+ | Dependency management and build tool |
| **Node.js & npm** | Node v24+ / npm 11+ | Executes Vite frontend dev server |
| **PostgreSQL** | Port `5432` (Active) | Multi-tenant database per service |

---

## 2. Method A: One-Click Automated Startup (Recommended)

Three dedicated PowerShell scripts are available in the root folder:

### Step 1: Start Database (PostgreSQL)
Ensure your local PostgreSQL service is running on port `5432` with username `postgres` and password `postgres`.
*(If you haven't created the databases yet, execute the script in [`backend/docker/init-databases.sql`](backend/docker/init-databases.sql) once in pgAdmin or psql).*

### Step 2: Start Backend Microservices
Open a PowerShell terminal in the project root and run:

```powershell
# Option 1: Start Core Infrastructure (Eureka + Gateway + Auth + College)
.\start-backend.ps1 -Core

# Option 2: Start ALL 22 microservices
.\start-backend.ps1 -All
```
*Each service will open in its own separate, monitored PowerShell window.*

### Step 3: Start Frontend Web Application
In a separate terminal in the project root, run:

```powershell
.\start-frontend.ps1
```
*The React application will be available at: **`http://localhost:5173/`** (or `http://localhost:5174/`)*.

### Step 4: Stop All Services When Done
To gracefully terminate all running backend Java processes and frontend servers:

```powershell
.\stop-all.ps1
```

---

## 3. Method B: Manual Step-by-Step Terminal Startup

If you prefer to start services individually or debug specific modules, use this order:

### 1. Eureka Service Registry (Port 8761) — *MUST START FIRST*
```powershell
cd backend/eureka-server
mvn spring-boot:run
```
> Wait ~10 seconds until console shows: `Started EurekaServerApplication`.  
> Access Dashboard: [http://localhost:8761](http://localhost:8761)

---

### 2. API Gateway (Port 8080)
```powershell
cd backend/api-gateway
mvn spring-boot:run
```
> The API Gateway routes all requests from the frontend (`http://localhost:8080/api/*`) to downstream microservices.

---

### 3. Core Identity & Multi-Tenant Services
Open individual terminals and run:

```powershell
# Terminal A: Auth Service (Port 8090)
cd backend/auth-service
mvn spring-boot:run

# Terminal B: College Master Service (Port 8091)
cd backend/college-service
mvn spring-boot:run
```

---

### 4. Domain & Campus Microservices (Start as needed)
Run `mvn spring-boot:run` in any service directory you wish to use:

```powershell
# Student & Faculty Management
cd backend/student-service; mvn spring-boot:run
cd backend/faculty-service; mvn spring-boot:run

# Academic Engine
cd backend/course-service; mvn spring-boot:run
cd backend/enrollment-service; mvn spring-boot:run
cd backend/attendance-service; mvn spring-boot:run
cd backend/exam-service; mvn spring-boot:run
cd backend/timetable-service; mvn spring-boot:run

# Campus Administration & Operations
cd backend/fee-service; mvn spring-boot:run
cd backend/library-service; mvn spring-boot:run
cd backend/hostel-service; mvn spring-boot:run
cd backend/transport-service; mvn spring-boot:run
cd backend/leave-service; mvn spring-boot:run
cd backend/placement-service; mvn spring-boot:run
cd backend/event-service; mvn spring-boot:run
cd backend/notification-service; mvn spring-boot:run
cd backend/document-service; mvn spring-boot:run
cd backend/helpdesk-service; mvn spring-boot:run
cd backend/report-service; mvn spring-boot:run
```

---

### 5. Frontend Development Server (Port 5173)
```powershell
cd frontend
npm install   # (only needed first time)
npm run dev
```

Open your browser at: **`http://localhost:5173/`**

---

## 4. Port Reference Map

| Component / Microservice | Local Port | Key URL / Endpoint |
| :--- | :--- | :--- |
| **Frontend Web App** | `5173` / `5174` | [http://localhost:5173/](http://localhost:5173/) |
| **Eureka Service Registry** | `8761` | [http://localhost:8761/](http://localhost:8761/) |
| **API Gateway** | `8080` | [http://localhost:8080/](http://localhost:8080/) |
| **auth-service** | `8090` | `/api/auth/login` |
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
