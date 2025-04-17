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
ENV FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC6hLJaKb961SZB\nO8QVAQ2TQolco09a4ysxm4G2pBThQ0D0BoPuxs9XcSzsqu8aeZYML10xKVsLo5g5\nKrq1rEYRQBfYVMrQ+zBZxBLIjBEJN7rcZDL+Bdt2ThusjNYIHRhmMW8inZwaghuw\nsA/QU/pfOaoCTaXu3Du5KDKh1wQBny7sTSQOY0cwt7Fgt2dvXRVlgZdIob2ezziB\nVYD57JekDJrP3FUR8jZxfG+OTig2oVpHemW+bZSiRLKhieeOP/MwnInIPGWjykX/\nzb2HELefco7CcMt2sHd9yHrjJCEO34p6DrDSdrw2lXFzXb/GwFUhVO//3HixrCcb\nCe+HkBvrAgMBAAECggEAA/ukcV912tIlbHwxvj8VAqGHnGZSYf7646bN+M/9MChH\nAU8ITzeIovXkPzORQo/5H859H3kiHBgEvqfGb+27W0/ykmiRIjBTAn+45PZ0wK0j\nfORY4GrQmnClj6Q8R9UTOc9xb5xNApXnsHi6BbldXd413rG4yuaCEfylRCZ6y+wI\nazkkB0UoMYeXZNE8wwIzX9x5VNQ16AZCcOwCSqJC0dlT0snKIg3EyTGBetUFImSE\ncuTd9Xvfi/t1UBgSu6MULAnTFJUf+w/wAWVneMypbKIJpXbH05FOZIOVUVfqhhfl\n/+vQT4dzppM0S4lcubT85Rww7hRj/5pZErrE85LaXQKBgQDyJk3XnbkLOjtnM/3Z\nr8rIi/WaXhRmO0a4W/995ulXqITinzLrjrhQS8I4hIGl3XdYVxXPmw5C/zb6ooCb\n8aK3F82fCle09v+lxyGtd/hxSCJTQRAtrdvW30uHg07dtOQ3tL7M+U1EbxPD2g6q\n+lONd4QwQiLMW+MbpU+Yz+x5bQKBgQDFL86YXoWQny3r5RYwgRw+wOFJOx8t0olr\n5lQNYh33EVzK6yFsd8+96U9D31xiQulIMo2WiAKpvZOQYkrnmy9su5wiXgEffeMI\nm+yRKjv+w7Ow8Pk2RzSrQvCWpWRsmUmBcvCLhoZEpcitAYvDehIfiidyaCZ/bca5\n3L32zaArtwKBgEAe2HoB7+ADOXuojs23+RCFzzFjPC+d/qoO4maqYJuvqhCAa3Fo\nx3GrvfBNVi9fp5yi4smom2wuPJa9tSSWJaoqCW7VxEfNKADz6/0NSaJloYE+N1SB\nNzd8xXlK0fVvUwdVOzj3wvgeGbPA6CVqR/mr7jsBKEnJAyhs69jhJhM5AoGAcepl\neucYWG1tVRs6j3j3PVWmkOzj3VAE7d3ZbwXg88wHBH+EBqrMzBUOItLWBzpKlNgH\nrhATIcaQilgOl/CyHCniUIRoN649S8rwhwiUMmES3UTJZE8MoWgBn7Ya5xZDPdKO\nHrzvspbn8PK0sJBECg6BLXn3y6Q6q0NYR02Rm88CgYBjgSWKmP41TJCfkX0C0exF\ne0ht5qwDkKhHjuYw4u0hdVkwVpUnGNjCiCVofbLwB503rNk3y6Lh2h/Edh9J5R8Q\ndnjiSCswM/xPkjL0AwiP8Rmsv+dn5fdJS3d8piatp0lYFaGWLnSPOlHWAqO2ORzU\nlunCyNXdcr4RSsi2CjfxFQ==\n-----END PRIVATE KEY-----\n"
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
