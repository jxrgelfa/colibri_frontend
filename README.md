# Colibrí Frontend

Entorno de desarrollo moderno configurado para la aplicación frontend de Colibrí.

## 🛠️ Stack Tecnológico

- **JavaScript + React**: React 19 con componentes funcionales y hooks en JavaScript moderno (ES6+).
- **Vite**: Bundler y entorno de desarrollo ultra rápido con soporte de Hot Module Replacement (HMR).
- **Tailwind CSS (v4)**: Motor Oxide nativo integrado a través de `@tailwindcss/vite`, configurado vía CSS-first.
- **HTML Semántico**: Estructuración accesible basada en estándares (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).

## 📁 Estructura del Proyecto

```text
colibri-frontend/
├── public/                 # Archivos estáticos e iconos
├── src/
│   ├── assets/             # Recursos estáticos locales
│   ├── App.jsx             # Componente raíz con maquetado semántico y Tailwind
│   ├── index.css           # Punto de entrada de estilos (@import "tailwindcss")
│   └── main.jsx            # Punto de montaje del Virtual DOM de React
├── index.html              # Plantilla HTML semántica principal
├── package.json            # Scripts y dependencias del proyecto
└── vite.config.js          # Configuración de Vite con plugins de React y Tailwind
```

## 🚀 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

- `npm run dev`: Inicia el servidor de desarrollo local con HMR.
- `npm run build`: Compila la aplicación optimizada para producción en la carpeta `dist/`.
- `npm run preview`: Previsualiza localmente el build de producción.
- `npm run lint`: Ejecuta el análisis estático de código con Oxlint sobre el directorio `src/`.
# colibri_frontend
