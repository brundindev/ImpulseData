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

# Reemplazar con variables de entorno para Firebase
ENV FIREBASE_TYPE="service_account"
ENV FIREBASE_PROJECT_ID="impulsedata-alicantefutura"
ENV FIREBASE_PRIVATE_KEY_ID="003919b5ce1ec429adedb8bd6d40db31668be389"
# IMPORTANTE: Para la clave privada, asegúrate de escapar los saltos de línea
# Reemplaza todos los \n literales con \\n en la cadena
ENV FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIE....\\n-----END PRIVATE KEY-----\\n"
ENV FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@impulsedata-alicantefutura.iam.gserviceaccount.com"
ENV FIREBASE_CLIENT_ID="102546228320055761282"
ENV FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
ENV FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
ENV FIREBASE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
ENV FIREBASE_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40impulsedata-alicantefutura.iam.gserviceaccount.com"

# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
