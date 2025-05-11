# Europa Game Price Tracker

Una aplicación web para seguir los precios de videojuegos en el mercado europeo, crear colecciones personales y recibir alertas de precios.

## Características principales

- **Seguimiento de precios en tiempo real** para juegos y consolas en el mercado europeo
- **Wishlist inteligente** con notificaciones de cambios de precio
- **Gestión de colección** para valorar tus juegos y ver la evolución del valor total
- **Búsqueda avanzada** con filtros por plataforma, condición, precio y género
- **Integración con afiliados** para comprar directamente en eBay o Amazon

## Tecnologías utilizadas

- **Frontend**: React con TypeScript, Tailwind CSS
- **Autenticación**: Firebase Authentication
- **Base de datos**: Firestore
- **API de precios**: PriceCharting API

## Requisitos previos

- Node.js (v14 o superior)
- NPM o Yarn
- Cuenta en Firebase
- Token de API de PriceCharting

## Configuración del entorno

1. Clona este repositorio:
   ```
   git clone https://github.com/tuusuario/europa-game-tracker.git
   cd europa-game-tracker
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   
   VITE_PRICECHARTING_API_TOKEN=tu_token_de_pricecharting
   VITE_API_BASE_URL=https://api.pricecharting.com/api
   ```

4. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```

## Estructura del proyecto

```
src/
│
├── api/              # Funciones para comunicarse con APIs externas
├── assets/           # Imágenes, iconos y otros recursos estáticos
├── components/       # Componentes reutilizables
│   ├── Auth/         # Componentes relacionados con la autenticación
│   ├── Layout/       # Componentes de estructura (Navbar, Footer)
│   ├── Search/       # Componentes de búsqueda
│   └── UI/           # Elementos de UI genéricos
├── contexts/         # Contextos de React (Auth, Wishlist, Collection)
├── firebase/         # Configuración de Firebase
├── hooks/            # Custom hooks (useDebounce, useFetchPrice)
├── pages/            # Componentes de página
│   ├── Auth/         # Páginas de autenticación
│   ├── Home/         # Página de inicio
│   ├── Search/       # Página de búsqueda
│   └── ...           # Otras páginas
├── styles/           # Estilos globales y configuración de Tailwind
└── utils/            # Funciones de utilidad
```

## Despliegue

La aplicación está configurada para ser desplegada en Vercel o Netlify.

1. Conecta tu repositorio a Vercel o Netlify
2. Configura las variables de entorno en el panel de control
3. Despliega la aplicación

## Características futuras

- Marketplace para que los usuarios vendan sus juegos
- Exportación de datos de colección a CSV
- Integración con eBay para listar juegos directamente
- Notificaciones por email o SMS para alertas de precio

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir lo que te gustaría cambiar.

## Licencia

[MIT](LICENSE)
