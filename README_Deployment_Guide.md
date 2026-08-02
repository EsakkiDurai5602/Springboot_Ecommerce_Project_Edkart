# EdKart E-Commerce: Local & Containerized Build Guide

This document describes how to compile, build, package, and execute the **EdKart** application locally and within Docker containers.

---

## 1. Local Development Execution (Without Docker)

To run the application directly on your local system, you need to configure your local MySQL database first.

### Step 1: Database Setup
Make sure you have MySQL running locally. Create a database named `edkart`:
```sql
CREATE DATABASE edkart;
```

### Step 2: Configure Environment Settings
By default, the application runs under the `dev` profile (specified in `application.properties`). If you need to override the local database credentials without modifying files, define them as environment variables in your local terminal session:
```powershell
# PowerShell
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="edkart"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="Durai5602.$"
```
```bash
# Bash
export DB_HOST="localhost"
export DB_PORT="3306"
export DB_NAME="edkart"
export DB_USERNAME="root"
export DB_PASSWORD="Durai5602.$"
```

### Step 3: Package and Compile the JAR
Execute the Maven build command using the provided wrapper script:
```bash
# Using standard maven wrapper (Windows CMD/PowerShell)
.\mvnw.cmd clean package

# Using maven wrapper (Mac/Linux)
./mvnw clean package
```
This command compiles the classes, runs the unit test suite, and builds the target executable JAR under the `target/` directory:
- `target/edkart-0.0.1-SNAPSHOT.jar`

### Step 4: Run the Executable JAR
```bash
java -jar target/edkart-0.0.1-SNAPSHOT.jar
```

---

## 2. Docker Containerization (Manual Commands)

To isolate the application environment, you can compile and containerize the Java process using the multi-stage `Dockerfile`.

### Step 1: Build the Docker Image
Execute this command in the root folder of the project (where `Dockerfile` is located):
```bash
docker build -t edkart-app:latest .
```
- **How it works:** The container runs a two-stage build. First, it downloads dependencies and compiles the source code inside a Maven build container. Second, it copies only the final runnable JAR to a minimal JRE 21 image, reducing image size to ~250MB.

### Step 2: Run the Standalone App Container
To start the application container, pass database coordinates so that the app container can reach your host database:
```bash
docker run -d \
  --name edkart-app \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_HOST=host.docker.internal \
  -e DB_NAME=edkart \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=Durai5602.$ \
  -e JWT_SECRET=9a4f2c5e7b8a1c3d9e0f2a4b6c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d \
  edkart-app:latest
```
*Note: `host.docker.internal` allows containers to access database instances running directly on the host computer.*

---

## 3. Orchestration with Docker Compose

Using Docker Compose is the recommended path for launching the entire application stack (App, MySQL database, and phpMyAdmin administrator console) with persistent storage.

### Step 1: Setup `.env` Configuration
Duplicate the provided `.env.example` file and save it as `.env`:
```bash
cp .env.example .env
```
Ensure that `.env` contains strong passwords for `DB_ROOT_PASSWORD` and `DB_PASSWORD`.

### Step 2: Boot Up the Stack
Use Docker Compose to build, link, and run all containers:
```bash
docker compose up -d --build
```
- **`-d`**: Runs containers in detached background mode.
- **`--build`**: Recompiles the Java image to ensure it runs the newest code changes.

### Step 3: Check Container Status
Verify that all services are online and active:
```bash
docker compose ps
```
You should see:
- `edkart-db` running on port 3306 (healthy)
- `edkart-app` running on port 8080 (healthy)
- `edkart-pma` (phpMyAdmin) running on port 8081

### Step 4: Access Logs
Monitor logs in real time:
```bash
# Monitor all services
docker compose logs -f

# Monitor only the spring boot app
docker compose logs -f app
```

### Step 5: Shutting Down the Stack
To stop the services while preserving database data:
```bash
docker compose down
```
To stop the services and completely wipe out databases (volumes):
```bash
docker compose down -v
```

---

## 4. Verification and Health Checks

Verify that the Spring Boot application is healthy using the standard Actuator endpoints:

### Actuator Health Status
Run a query using `curl` or access it directly via your browser:
```bash
curl http://localhost:8080/actuator/health
```
**Expected Response:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "MySQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 249000000000,
        "free": 182000000000,
        "threshold": 10485760,
        "exists": true
      }
    },
    "ping": {
      "status": "UP"
    }
  }
}
```

### Metrics Endpoint
To view runtime memory usage, JVM threads, or CPU utilization:
```bash
curl http://localhost:8080/actuator/metrics
```
