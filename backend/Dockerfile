FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy

LABEL maintainer="EdCode Devs"
LABEL description="Production image for EdKart E-Commerce App"

WORKDIR /app

RUN groupadd -r springgroup && useradd -r -g springgroup -d /app -s /sbin/nologin springapp

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/edkart-0.0.1-SNAPSHOT.jar app.jar

RUN mkdir -p /app/uploads /app/logs && chown -R springapp:springgroup /app/logs /app/uploads /app/app.jar /app

USER springapp

EXPOSE 8085

ENV SPRING_PROFILES_ACTIVE=prod
ENV APP_TIMEZONE=UTC
ENV UPLOADS_DIR=/app/uploads/

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

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8085/actuator/health || exit 1
