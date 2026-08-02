# =========================================================================
# STAGE 1: BUILD THE APPLICATION
# =========================================================================
# Using Maven with Eclipse Temurin JDK 21 as the build container
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set the working directory inside the build container
WORKDIR /app

# Copy the pom.xml to cache dependency downloads first
COPY pom.xml .

# Pre-download dependencies to utilize Docker layer caching
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the production JAR file, skipping unit tests for speed (CI handles testing)
RUN mvn clean package -DskipTests

# =========================================================================
# STAGE 2: PRODUCTION RUNTIME ENVIRONMENT
# =========================================================================
# Using Eclipse Temurin JRE 21 on Ubuntu (Jammy) for minimum footprint and security
FROM eclipse-temurin:21-jre-jammy

# Add labels for image metadata
LABEL maintainer="EdCode Devs"
LABEL description="Production image for EdKart E-Commerce App"

# Setup working directory
WORKDIR /app

# Create a system group and user to run the application (Security Best Practice)
# Run as non-root user 'springapp' to mitigate potential container escape exploits
RUN groupadd -r springgroup && useradd -r -g springgroup -d /app -s /sbin/nologin springapp

# Install curl in JRE image for actuator healthcheck capabilities
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Copy the compiled JAR from Stage 1 builder
COPY --from=builder /app/target/edkart-0.0.1-SNAPSHOT.jar app.jar

# Create an uploads folder inside the container with proper user ownership
RUN mkdir -p /app/uploads && chown -R springapp:springgroup /app

# Switch to the non-root user
USER springapp

# Expose default application port
EXPOSE 8080

# Environment variables for default execution tuning
ENV SPRING_PROFILES_ACTIVE=prod
ENV APP_TIMEZONE=UTC
ENV UPLOADS_DIR=/app/uploads/

# Optimized JVM memory and garbage collection options
# MaxRAMPercentage dynamically adjusts JVM heap size based on Docker container limits (75%)
# Use G1GC for low-latency response times
# ExitOnOutOfMemoryError terminates container so orchestrator restarts it if heap leaks
ENTRYPOINT ["java", \
            "-XX:MaxRAMPercentage=75.0", \
            "-XX:MinRAMPercentage=50.0", \
            "-XX:+UseG1GC", \
            "-XX:+ExitOnOutOfMemoryError", \
            "-Djava.security.egd=file:/dev/./urandom", \
            "-Duser.timezone=UTC", \
            "-Dfile.encoding=UTF-8", \
            "-jar", \
            "app.jar"]

# Actuator-based Health Check
# Checks health status every 30s. Marks container unhealthy if response code is not 200.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
