# Usa una imagen de Maven para construir la aplicación
FROM maven:3.8.4-openjdk-17 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración y dependencias
COPY pom.xml .

# Descarga las dependencias
RUN mvn dependency:go-offline

# Copia el resto de los archivos de la aplicación
COPY src ./src

# Compila la aplicación
RUN mvn package -DskipTests

# Usa una imagen de OpenJDK para ejecutar la aplicación
FROM openjdk:17-jdk-slim

# Copia el archivo JAR desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar

# Copia el archivo de credenciales de Firebase desde la etapa de construcción
COPY --from=build /app/src/main/resources/impulsedata-alicantefutura-firebase-adminsdk-fbsvc-01841a49ee.json /app/impulsedata-alicantefutura-firebase-adminsdk-fbsvc-01841a49ee.json

# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
