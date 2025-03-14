# <img src="/docs/img/ImpulseData_Logo.png" alt="ImpulseData" width="400" height="400">




# 🚀 ImpulseData - Alicante Futura Lab

> by Fiorella Arizpe, Jose Antonio Giménez, Adrián Reynau & Alejandro Jiménez Brundin.

[![github release version](https://img.shields.io/github/v/release/brundindev/ImpulseData.svg?include_prereleases)](https://github.com/brundindev/ImpulseData/releases/latest) [![npm version](https://img.shields.io/npm/v/@toast-ui/editor.svg)](https://www.npmjs.com/package/@toast-ui/editor) [![license](https://img.shields.io/github/license/brundindev/tui.editor.svg)](https://github.com/nhn/tui.editor/blob/master/LICENSE) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/nhn/tui.editor/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) [![code with hearth by ImpulseData](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-ImpulseData-ff1414.svg)](https://github.com/nhn)

### [Imagen del proyecto próximamente...]

## 🚩 Table of Contents

- [Descripción](#-📌01.-descripcion-del-proyecto)
- [Información Relevante](#-features)
- [Finalidad](#-examples)
- [Requisitos Técnicos  ](#-browser-support)
- [Despliegue y evaluación](#-pull-request-steps)
- [Contributing](#-contributing)
- [Used](#-used)
- [Licencia](#-licencia)

## 📌 01. Descripción del Proyecto  
Este documento define los requisitos técnicos para la automatización y estructuración de información dentro del marco de **Impulsalicante**.  

📊 La aplicación permitirá:  
✅ Organizar datos en **categorías específicas**.  
✅ **Generar informes estructurados** de manera dinámica y actualizable.  
✅ Mantener **coherencia visual** con la *Memoria Anual de Impulsalicante (2023)*, sin necesidad de replicarla exactamente.  

---

## 🎯 02. Información Relevante  

### 🎯 **Objetivos del Proyecto**  
🔹 Desarrollar una **plataforma** capaz de capturar, organizar y presentar datos automáticamente.  
🔹 Implementar un **sistema modular** que permita la actualización y expansión sin afectar la estructura.  
🔹 Garantizar una **interfaz intuitiva y accesible** centrada en la experiencia del usuario (UX).  
🔹 Optimizar el **procesamiento y almacenamiento** de datos con tecnologías escalables.  
🔹 **Generar y descargar informes en PDF** con un formato similar a la *Memoria Anual de Impulsalicante*.  
🔹 **Simular el uso real del sistema** con datos ficticios (mínimo **50-60 registros por categoría**) para evaluar el rendimiento.  

---

## 🎯 03. Finalidad  
📌 **Objetivo principal**: Facilitar la gestión y visualización de información relevante sobre centros, asistentes, actividades, KPIs y otros aspectos de **Impulsalicante**.  

🔎 **El sistema permitirá:**  
✔️ **Actualización continua** de datos.  
✔️ **Generación automática** de documentos estructurados.  
✔️ **Cobertura flexible** de categorías, incluyendo aquellas identificadas en la *Memoria Anual de Impulsalicante*.  

---

## 🛠️ 04. Requisitos Técnicos  

### 🎨 1️⃣ **Frontend (Interfaz de Usuario)**  
🖥️ **Lenguajes y Frameworks:** Vue.js.
🎨 **Diseño UI/UX:** Bootstrap.
🔐 **Autenticación:** Firebase Authentication.
📊 **Visualización:** Generación de informes automatizados con plantillas dinámicas.  
📄 **Exportación de datos:** Funcionalidad para descargar cada ficha en **PDF** con un diseño similar a la *Memoria Anual de Impulsalicante*.  

---

### 🖥️ 2️⃣ **Backend (Gestión de Datos y Lógica de Negocios)**  
🚀 **Lenguajes:**  
- Java con Spring Boot  

🗄️ **Base de Datos:** Firebase Database 
🔄 **Automatización de datos:** Scripts para estructuración y actualización de la información.  
📡 **API RESTful:** Para la comunicación con el frontend.  
📥 **Carga de datos simulados:** Capacidad para manejar al menos **50-60 registros por categoría**.  

---

### 🔐 3️⃣ **Seguridad y Moderación**  
🔒 **Cifrado de datos:** Implementación de `bcrypt.js` para seguridad.  
🔑 **Acceso controlado:** Uso de **JWT** para autenticación de usuarios o similares.  
📈 **Monitorización de datos:** Protección de la integridad en la actualización de información.  

---

## 🌐 05. Despliegue y Evaluación  

☁️ Se recomienda desplegar la plataforma en internet utilizando servicios como:  
- **Vercel**  
- **Netlify**  
- **Firebase Hosting**  
- **AWS**  
- **Heroku**  

🔎 **El despliegue permitirá evaluar** estabilidad, rendimiento y accesibilidad en un entorno real.  

✨ **Valoración Adicional:**  
✅ Mejoras en la **experiencia de usuario**.  
✅ Incremento en la **seguridad**.  
✅ Integración con **nuevas tecnologías**.  
✅ Funcionalidades adicionales que aporten valor al sistema.  

📌 **Las optimizaciones que demuestren creatividad, eficiencia e impacto positivo** en la usabilidad y escalabilidad del proyecto será nuestro objetivo.  

## 🚀 Used

* [Java](https://java.com)
* [Bootstrap](https://bootstrap.com)
* [Vue.js](https://vuejs.org)
* [Firebase Authentication](https://firebase.com)
* [Firebase Database](https://firebase.com)
* [Javascript](https://developer.mozilla.org/es/docs/Web/JavaScript)
* [Springboot](https://spring.io/projects/spring-boot)


## 📜 Licencia

This software is licensed under the [MIT](https://github.com/brundindev/ImpulseData/blob/main/LICENSE) © [ImpulseData](https://github.com/brundindev/ImpulseData).
