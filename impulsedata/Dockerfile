# Usa una imagen de Maven para construir la aplicación
FROM maven:3.8-openjdk-17 as build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración y dependencias
COPY . .

# Descarga las dependencias
RUN mvn clean package -DskipTests

# Usa una imagen de OpenJDK para ejecutar la aplicación
FROM openjdk:17-jdk-slim

# Copia el archivo JAR desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar

# Crear directorio para la configuración de Firebase
RUN mkdir -p /app/config

# Copiar el archivo de la clave de servicio de Firebase
COPY src/main/resources/impulsedata-alicantefutura-firebase-adminsdk-fbsvc-01841a49ee.json /app/config/firebase-service-account.json

# Variable de entorno que apunta al archivo de configuración
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/config/firebase-service-account.json

# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
