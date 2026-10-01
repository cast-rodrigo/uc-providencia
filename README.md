# UC Providencia ⚪🔵

Sitio web del equipo de fútbol infantil **UC Providencia** (Universidad Católica, sede Providencia).
*Con la franja en el corazón.*

Está hecho con [Astro](https://astro.build) y [Tailwind CSS](https://tailwindcss.com). Es un sitio estático: no tiene base de datos ni servidor propio. **Todo el contenido está en archivos de texto** que puedes editar sin saber programar.

---

## Índice

1. [Lo que necesitas instalar (una sola vez)](#1-lo-que-necesitas-instalar-una-sola-vez)
2. [Ver el sitio en tu computador](#2-ver-el-sitio-en-tu-computador)
3. [Subirlo a GitHub](#3-subirlo-a-github)
4. [Publicarlo en Netlify](#4-publicarlo-en-netlify)
5. [Instagram: feed automático con Behold](#5-instagram-feed-automático-con-behold)
6. [Actualización diaria automática](#6-actualización-diaria-automática)
7. [Cómo editar el contenido](#7-cómo-editar-el-contenido)
8. [Cambiar el nombre del sitio (dominio)](#8-cambiar-el-nombre-del-sitio-dominio)
9. [Privacidad de los niños](#9-privacidad-de-los-niños)
10. [Si algo falla](#10-si-algo-falla)

---

## 1. Lo que necesitas instalar (una sola vez)

- **Node.js 22** (versión LTS): descárgalo desde <https://nodejs.org> e instálalo con las opciones por defecto.
- **Git**: <https://git-scm.com/download/win>.
- Un editor de texto cómodo, por ejemplo **Visual Studio Code**: <https://code.visualstudio.com>.
- Una cuenta en **GitHub** (<https://github.com>) y otra en **Netlify** (<https://netlify.com>, puedes entrar con tu cuenta de GitHub).

Para comprobar que quedó bien, abre una terminal (en Windows: botón Inicio → escribe "PowerShell") y escribe:

```bash
node -v
```

Debería responder algo como `v22.x.x` (o superior).

## 2. Ver el sitio en tu computador

En la terminal, entra a la carpeta del proyecto y ejecuta:

```bash
npm install
```

(solo la primera vez, o cuando cambien las dependencias). Luego:

```bash
npm run dev
```

Abre <http://localhost:4321> en el navegador. Cada vez que guardes un archivo, la página se actualiza sola. Para detenerlo, presiona `Ctrl + C` en la terminal.

Para revisar la versión final (la misma que se publica):

```bash
npm run build
```

Si termina con `Complete!`, todo está bien.

## 3. Subirlo a GitHub

1. Entra a <https://github.com/new>.
2. Nombre del repositorio: `uc-providencia`. Déjalo **Público** o **Privado** (Netlify funciona con ambos). **No** marques "Add a README".
3. Presiona **Create repository**.
4. En la terminal, dentro de la carpeta del proyecto, ejecuta estos comandos uno por uno (cambia `TU-USUARIO` por tu usuario de GitHub):

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Primera versión del sitio UC Providencia"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/TU-USUARIO/uc-providencia.git
```

```bash
git push -u origin main
```

La primera vez, Git te pedirá iniciar sesión en GitHub en una ventana del navegador.

**De ahí en adelante**, cada vez que cambies algo, basta con:

```bash
git add .
```

```bash
git commit -m "Actualizo el próximo partido"
```

```bash
git push
```

…y Netlify publica los cambios solo, en uno o dos minutos.

## 4. Publicarlo en Netlify

1. Entra a <https://app.netlify.com> → **Add new site** → **Import an existing project**.
2. Elige **GitHub** y autoriza a Netlify a ver tus repositorios.
3. Selecciona `uc-providencia`.
4. Netlify detecta la configuración sola gracias al archivo `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Presiona **Deploy**. En un par de minutos tendrás una dirección del tipo `algo-raro-123.netlify.app`. (Para cambiarla, ve a la [sección 8](#8-cambiar-el-nombre-del-sitio-dominio).)

## 5. Instagram: feed automático con Behold

El sitio muestra las últimas publicaciones de [@catolica.providencia](https://www.instagram.com/catolica.providencia/) de dos maneras posibles:

### Opción A (recomendada): Behold.so

[Behold](https://behold.so) es un servicio (tiene plan gratuito) que convierte el Instagram del equipo en un "feed" que el sitio puede leer. Las imágenes se muestran directamente en el sitio, rápido y sin cookies de Instagram.

1. Crea una cuenta en <https://behold.so>.
2. Conecta la cuenta de Instagram del equipo. **Ojo:** debe ser una cuenta **profesional** (Empresa o Creador) y alguien con acceso a ella debe autorizar.
3. Crea un feed nuevo de tipo **JSON** y copia la URL que te entrega (algo como `https://feeds.behold.so/AbCdEf123`).
4. En Netlify: **Site configuration → Environment variables → Add a variable**:
   - Key: `BEHOLD_FEED_URL`
   - Value: la URL que copiaste.
5. Ve a **Deploys → Trigger deploy → Deploy site** para que se publique con el feed.

Para probarlo en tu computador, crea un archivo llamado `.env` en la carpeta del proyecto (puedes copiar `.env.example`) con:

```
BEHOLD_FEED_URL=https://feeds.behold.so/AbCdEf123
```

### Opción B (respaldo): publicaciones elegidas a mano

Si no hay `BEHOLD_FEED_URL`, o si Behold falla, el sitio **no se rompe**: usa la lista del archivo `src/data/instagram.json`. Ahí puedes pegar los links de las publicaciones que quieras mostrar:

```json
{
  "posts": [
    "https://www.instagram.com/p/C1a2b3c4d5e/",
    "https://www.instagram.com/reel/C9z8y7x6w5v/"
  ]
}
```

Se muestran con el visor oficial de Instagram, que se carga solo cuando el visitante llega a esa sección. (Ese visor es de Instagram y puede usar cookies propias; por eso conviene la opción A.)

Si la lista está vacía (o solo tiene los links de ejemplo), el sitio muestra una invitación a seguir la cuenta.

## 6. Actualización diaria automática

El sitio se arma cada vez que se publica. Para que el feed de Instagram y el "próximo partido" se actualicen **solos todos los días**, se usa una tarea programada de GitHub que le pide a Netlify republicar cada mañana. Solo hay que configurarla una vez:

1. **Crear la tarea en GitHub** (desde la web, porque Git en el computador no tiene permiso para subir este tipo de archivo):
   - En tu repositorio, ve a la pestaña **Actions → set up a workflow yourself**.
   - Cambia el nombre del archivo a `actualizar-diario.yml`.
   - Copia y pega el contenido completo de [`docs/actualizar-diario.yml`](docs/actualizar-diario.yml).
   - Presiona **Commit changes**.
   - En tu computador, ejecuta `git pull` para traer ese cambio antes de tu próximo `git push`.
2. En Netlify: **Site configuration → Build & deploy → Build hooks → Add build hook**.
   Nombre: `Actualización diaria`, rama: `main`. Copia la URL que aparece.
3. En GitHub, en tu repositorio: **Settings → Secrets and variables → Actions → New repository secret**.
   - Name: `NETLIFY_BUILD_HOOK`
   - Secret: la URL que copiaste.
4. Listo. Para probarla de inmediato: pestaña **Actions → Actualizar sitio a diario → Run workflow**.

Se ejecuta todos los días cerca de las 7:00 (hora de Chile). Para cambiar la hora, edita la línea `cron` del archivo (está en hora UTC).

## 7. Cómo editar el contenido

Todos los textos están en la carpeta `src/data/`. Son archivos **JSON**: respeta las comillas `"`, las comas `,` entre elementos y **no dejes coma después del último**. Si te equivocas, `npm run build` (o Netlify) te avisará con un error y el sitio publicado seguirá igual que antes.

> 💡 Puedes editar los archivos directo en la web de GitHub: abre el archivo, presiona el lápiz ✏️, cambia lo que necesites y presiona **Commit changes**. Netlify publica solo.

### Datos generales — `src/data/sitio.json`

```json
{
  "nombre": "UC Providencia",
  "lema": "Con la franja en el corazón",
  "bajada": "Fútbol infantil de la Universidad Católica, sede Providencia…",
  "temporada": "Temporada 2026",
  "urlSitio": "https://ucprovidencia.netlify.app",
  "instagramUrl": "https://www.instagram.com/catolica.providencia/",
  "instagramUsuario": "@catolica.providencia",
  "indexarEnGoogle": true
}
```

### Partidos — `src/data/partidos.json`

```json
{
  "proximos": [
    {
      "rival": "Deportivo Los Leones",
      "fecha": "2026-10-03",
      "hora": "10:30",
      "cancha": "Complejo Deportivo Las Encinas, cancha 2",
      "condicion": "local",
      "torneo": "Liga Oriente Sub-10"
    }
  ],
  "resultados": [
    {
      "rival": "Atlético Pedreros",
      "fecha": "2026-09-26",
      "condicion": "visita",
      "golesNuestros": 3,
      "golesRival": 2,
      "torneo": "Liga Oriente Sub-10"
    }
  ]
}
```

- **Fecha** siempre en formato `AAAA-MM-DD` y **hora** en `HH:MM` (hora de Chile).
- **condicion**: `"local"` o `"visita"`.
- Puedes dejar varios partidos en `proximos`: el sitio muestra automáticamente el más cercano que todavía no se ha jugado, con su cuenta regresiva.
- Después de cada partido, agrega el resultado en `resultados` (el orden no importa; se muestran los 6 más recientes).

### Plantel — `src/data/plantel.json`

```json
{
  "categoria": "Sub-10",
  "jugadores": [
    { "numero": 10, "nombre": "Maxi", "posicion": "Mediocampista", "foto": "", "mostrarFoto": false }
  ]
}
```

- **nombre**: solo nombre de pila o apodo. Nunca apellidos.
- **posicion**: `Arquero`, `Defensa`, `Mediocampista` o `Delantero` (se ordenan en ese orden).
- **Fotos**: guarda la foto en `src/assets/plantel/` (por ejemplo `maxi.jpg`), escribe `"foto": "maxi.jpg"` y cambia `"mostrarFoto": true`. **Solo hazlo con autorización de la familia.** Mientras `mostrarFoto` sea `false`, se ve una silueta con la franja y el número.

### Cuerpo técnico — `src/data/staff.json`

```json
[
  {
    "nombre": "Profe Rodrigo",
    "rol": "Entrenador",
    "descripcion": "Exjugador de las series menores de la UC…",
    "foto": ""
  }
]
```

Foto opcional: guárdala en `src/assets/staff/` y escribe el nombre del archivo en `"foto"`.

### Entrenamientos y ubicación — `src/data/entrenamientos.json`

```json
{
  "horarios": [
    { "dia": "Martes", "hora": "17:30 a 19:00", "detalle": "Técnica y juego" }
  ],
  "nota": "Llegar 15 minutos antes, con canilleras y botella de agua.",
  "ubicacion": {
    "nombre": "Cancha de entrenamiento",
    "direccion": "Av. Providencia 1234, Providencia, Santiago",
    "lat": -33.4295,
    "lon": -70.6135
  }
}
```

Para obtener **lat** y **lon**: en Google Maps, haz clic derecho sobre la cancha; el primer dato del menú son las coordenadas (ej. `-33.4295, -70.6135`). Haz clic para copiarlas.

### Galería — carpeta `src/assets/galeria/`

- Copia las fotos ahí (`.jpg`, `.png` o `.webp`). Se muestran ordenadas por nombre de archivo, así que conviene nombrarlas `01-…`, `02-…`, etc. El sitio las optimiza solo: no importa que pesen mucho.
- **Borra las 8 fotos de ejemplo** (las que dicen "Foto de ejemplo · reemplázame").
- Escribe una descripción corta de cada foto en `src/data/galeria.json` (sirve para personas ciegas que usan lector de pantalla):

```json
{
  "fotos": {
    "01-calentamiento.jpg": "El equipo calentando antes del partido"
  }
}
```

### Texto "Ser cruzado" — `src/content/ser-cruzado.md`

Texto normal. Para poner algo en **negrita**, enciérralo entre dos asteriscos: `**así**`.

### Escudo

Copia el archivo **oficial** del escudo como `public/escudo-uc.svg` (o `public/escudo-uc.png`, ojalá con fondo transparente y cuadrado). Aparece solo en el menú, el hero y el pie de página. Mientras no exista, se ve un recuadro que dice "Escudo aquí".

### Imagen para compartir (WhatsApp, Facebook)

Es `public/og-uc-providencia.jpg` (1200 × 630 px). Puedes reemplazarla por una foto del equipo del mismo tamaño y con el mismo nombre. **Recomendación:** una foto donde no se distingan las caras de los niños, o con autorización de las familias.

### Colores

Están en `src/styles/global.css`, en el bloque `@theme`. Por ejemplo, `--color-uc-azul: #20609f;` es el azul principal (tomado de cruzados.cl).

## 8. Cambiar el nombre del sitio (dominio)

1. En Netlify: **Site configuration → General → Site details → Change site name**.
2. Escribe `ucprovidencia` (si está libre) → tu sitio quedará en `https://ucprovidencia.netlify.app`.
3. Actualiza `"urlSitio"` en `src/data/sitio.json` con esa misma dirección y publica (`git add .`, `git commit`, `git push`). Esto hace que el sitemap y la vista previa en WhatsApp usen la dirección correcta.

Si algún día compran un dominio propio (ej. `ucprovidencia.cl`), se agrega en **Domain management → Add a domain** y se actualiza `urlSitio` de la misma forma.

## 9. Privacidad de los niños

Los jugadores son menores de edad. Por eso, por defecto:

- Solo nombre de pila o apodo. **Sin apellidos, sin fechas de nacimiento, sin RUT, sin colegios.**
- Las fotos de jugadores están **apagadas** (`"mostrarFoto": false`) y se activan una a una.
- El sitio **no usa cookies ni herramientas de seguimiento** (Google Analytics, Facebook Pixel, etc.).
- **Dejar el sitio fuera de Google:** en `src/data/sitio.json` cambia `"indexarEnGoogle": false`. Eso agrega la etiqueta `noindex` en todas las páginas y bloquea los buscadores en `robots.txt`. El sitio seguirá funcionando para quien tenga el link.

## 10. Si algo falla

- **El build falla en Netlify:** revisa el registro (Deploys → el deploy en rojo). Casi siempre es una coma o comilla de más/de menos en un JSON. El sitio publicado no se cae: sigue mostrando la última versión buena.
- **No aparece el feed de Instagram:** revisa que `BEHOLD_FEED_URL` esté bien escrita en Netlify y vuelve a publicar. Mientras tanto se usa el respaldo.
- **El "próximo partido" no cambió:** se recalcula cada vez que se publica. Con la actualización diaria (sección 6) se arregla solo; si no, publica a mano desde Netlify (**Trigger deploy**).

---

### Estructura del proyecto (para curiosos)

```
src/
  data/          ← textos y datos editables (JSON)
  content/       ← textos largos (Markdown)
  assets/
    galeria/     ← fotos de la galería
    plantel/     ← fotos de jugadores (opcional)
    staff/       ← fotos del cuerpo técnico (opcional)
  components/    ← cada sección del sitio
  pages/         ← páginas: inicio y /galeria
  styles/        ← colores y tipografías
public/          ← escudo, favicon, imagen para compartir
```

Hecho con amor por un papá cruzado ⚪🔵
