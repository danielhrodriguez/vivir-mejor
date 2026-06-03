# 🌿 Vivir Mejor — Guía de instalación

## ¿Qué contiene este proyecto?

```
vivir-mejor/
├── src/                      ← Toda la app web
│   ├── index.html            ← Punto de entrada
│   ├── manifest.json         ← Config PWA
│   ├── css/
│   │   └── app.css           ← Todos los estilos
│   └── js/
│       ├── data.js           ← Estado y localStorage
│       ├── utils.js          ← Funciones compartidas
│       ├── router.js         ← Navegación entre pantallas
│       ├── app.js            ← Arranque de la app
│       └── pages/
│           ├── welcome.js
│           ├── home.js
│           ├── sleep.js
│           ├── water.js
│           ├── exercise.js
│           ├── mood.js
│           ├── stats.js
│           ├── reminders.js
│           └── premium.js
├── capacitor.config.json     ← Config de Capacitor
├── package.json              ← Dependencias Node
└── README.md                 ← Esta guía
```

---

## OPCIÓN A — Ver la app en el navegador (sin instalar nada)

Abrí el archivo `src/index.html` directo en tu navegador.
Eso es todo. La app corre sin servidor.

---

## OPCIÓN B — Convertir a APK para Android

### Requisitos previos (instalar una sola vez)

| Herramienta | Descarga | Notas |
|---|---|---|
| Node.js 18+ | https://nodejs.org | Elegí versión LTS |
| Android Studio | https://developer.android.com/studio | Incluye SDK y emulador |
| Java JDK 17 | Viene con Android Studio | No instalar por separado |

### Pasos

**1. Abrí una terminal en la carpeta del proyecto**

```bash
cd vivir-mejor
```

**2. Instalá las dependencias**

```bash
npm install
```

**3. Agregá la plataforma Android**

```bash
npx cap add android
```

**4. Sincronizá el código web con el proyecto Android**

```bash
npx cap sync
```

**5. Abrí Android Studio**

```bash
npx cap open android
```

**6. Generá el APK**

Dentro de Android Studio:
- Menú: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- Esperá que termine (1-3 minutos)
- Hacé clic en `locate` en la notificación que aparece

El APK queda en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**7. Instalá en tu teléfono**

- Conectá el teléfono por USB con "Depuración USB" activada, o
- Copiá el APK al teléfono y abrilo desde el administrador de archivos

---

## OPCIÓN C — Sin instalar nada (PWABuilder online)

1. Subí la carpeta `src/` a cualquier hosting gratuito:
   - **Netlify** → netlify.com (arrastrá la carpeta)
   - **GitHub Pages** → github.com
   - **Vercel** → vercel.com

2. Entrá a **pwabuilder.com**

3. Pegá la URL de tu app publicada

4. Hacé clic en **"Build my PWA"** → Android

5. Descargá el APK generado automáticamente

---

## Personalización

### Cambiar nombre de usuario
En `src/js/data.js`, línea 10:
```js
userName: 'Ana Martínez',   // ← cambiá por el nombre que quieras
userInitials: 'AM',          // ← iniciales para el avatar
```

### Cambiar colores
En `src/css/app.css`, líneas 8-21 (variables CSS):
```css
--sage:    #7BAE8E;   /* Verde principal */
--sky:     #7BB5C8;   /* Azul */
--peach:   #E8A87C;   /* Naranja/durazno */
--lavender:#9B8EC4;   /* Violeta */
--amber:   #D4A55A;   /* Amarillo/dorado */
```

### Agregar más hábitos
Agregá una nueva entrada en `VM.state` en `data.js`
y creá un archivo nuevo en `src/js/pages/`.

---

## Tecnologías usadas

- **HTML5 / CSS3 / JavaScript** puro (sin frameworks)
- **Capacitor 5** para empaquetar como APK nativo
- **Google Fonts** — Nunito + Lora
- **Tabler Icons** — íconos open source
- **localStorage** — persistencia local de datos

---

## Próximos pasos sugeridos

- [ ] Conectar backend (Firebase / Supabase) para sync en la nube
- [ ] Agregar autenticación con Google
- [ ] Implementar notificaciones push reales con `@capacitor/local-notifications`
- [ ] Publicar en Google Play Store
- [ ] Agregar pantalla de medicamentos con calendario
- [ ] Integrar gráficos avanzados con Chart.js

---

*Vivir Mejor — v1.0.0*
