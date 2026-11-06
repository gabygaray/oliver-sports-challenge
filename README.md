# Reporte de sesión con IA

Dashboard para el cuerpo técnico de un equipo de fútbol. Muestra las métricas del wearable de cada jugador por sesión, resalta las que superan los umbrales del equipo y genera, con un modelo de lenguaje, un reporte breve de la sesión y un reporte de evolución por jugador. La interfaz está en español o en inglés y los reportes se piden en el idioma activo.

## Requisitos

- Node.js 22
- Yarn 1 (classic)
- Docker, para la base de datos PostgreSQL
- Una API key gratuita de Google AI Studio para los reportes con IA (opcional: sin ella la API arranca igual y los endpoints de reportes responden `503 AI_NOT_CONFIGURED`)

## Puesta en marcha

### 1. Base de datos

```bash
cd backend
cp .env.example .env        # completar AI_API_KEY si se quieren generar reportes
docker compose up -d        # PostgreSQL 16 en el puerto DB_PORT (5433 por defecto)
```

### 2. Esquema y datos

```bash
yarn install
yarn db:setup               # corre las migraciones y carga session_data.json
```

El seed es idempotente: se puede repetir con `yarn seed` sin duplicar filas.

### 3. API

```bash
yarn dev                    # http://localhost:3080
```

### 4. Frontend

En otra terminal:

```bash
cd frontend
cp .env.example .env        # VITE_APP_API_BASE=http://localhost:3080
yarn install
yarn dev                    # http://localhost:5173
```

### Scripts

| Paquete  | Script                                         | Qué hace                            |
| -------- | ---------------------------------------------- | ----------------------------------- |
| backend  | `yarn dev`                                     | API en modo desarrollo con recarga  |
| backend  | `yarn build` / `yarn start`                    | Compila a `dist/` y la corre        |
| backend  | `yarn db:setup`                                | Migraciones más seed                |
| backend  | `yarn seed`                                    | Vuelve a cargar `session_data.json` |
| backend  | `yarn migration:run` / `yarn migration:revert` | Migraciones de TypeORM              |
| backend  | `yarn test` / `yarn test:watch`                | Tests con Vitest                    |
| backend  | `yarn lint` / `yarn typecheck` / `yarn format` | Calidad de código                   |
| frontend | `yarn dev`                                     | Vite en modo desarrollo             |
| frontend | `yarn build` / `yarn preview`                  | Build de producción y vista previa  |
| frontend | `yarn lint` / `yarn typecheck`                 | Calidad de código                   |

### Variables de entorno

Backend (`backend/.env`):

| Variable                                                  | Default                                           | Para qué                                                                                       |
| --------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `PORT`                                                    | `3080`                                            | Puerto de la API                                                                               |
| `CORS_ORIGIN`                                             | `http://localhost:5173`                           | Origen permitido para el frontend                                                              |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | `localhost`, `5433`, `oliver`, `oliver`, `oliver` | Conexión a PostgreSQL; `docker-compose.yml` usa los mismos valores                             |
| `AI_BASE_URL`                                             | endpoint compatible con OpenAI de Gemini          | Cualquier API de chat completions compatible con OpenAI                                        |
| `AI_API_KEY`                                              | vacío                                             | La key del proveedor. Nunca se sube al repositorio                                             |
| `AI_MODEL`                                                | `gemini-3.5-flash`                                | Modelo a usar; `gemini-3.5-flash-lite` como alternativa cuando se agota la cuota gratuita      |
| `AI_TIMEOUT_MS`                                           | `30000`                                           | Plazo por llamada al modelo                                                                    |
| `AI_REASONING_EFFORT`                                     | `none`                                            | Razonamiento del modelo; `lite` exige `low`; vacío para proveedores que no aceptan el campo    |
| `AI_REASONING_TOKENS_ALLOWANCE`                           | `1500`                                            | Tokens extra para razonar cuando está activo, porque Gemini los descuenta del límite de salida |

Frontend (`frontend/.env`):

| Variable            | Default                 | Para qué      |
| ------------------- | ----------------------- | ------------- |
| `VITE_APP_API_BASE` | `http://localhost:3080` | URL de la API |

## Tecnologías

**Backend**

- Node.js 22 con TypeScript
- Express 5
- TypeORM sobre PostgreSQL 16, con migraciones SQL escritas a mano
- Zod para validar parámetros, cuerpos y la respuesta del modelo
- pino para logs
- Vitest para tests
- Cliente propio de chat completions compatible con OpenAI (sin SDK del proveedor), con streaming por Server-Sent Events

**Frontend**

- React 18 con TypeScript y Vite
- MUI 6 renderizado con styled-components, más MUI X Charts para el gráfico
- Redux Toolkit Query para las llamadas a la API
- EventSource nativo para el streaming de reportes
- Tipografía Rubik y paleta tomadas del sitio de OLIVER

## Estructura del proyecto

```
.
├── docs/
│   ├── FLOW.md                   Flujo de un reporte con IA, con diagrama y notas por etapa
│   └── PROCESO.md                Cómo se construyó: etapas, revisiones, decisiones y verificación
├── backend/
│   ├── docker-compose.yml        PostgreSQL para desarrollo
│   ├── session_data.json         Dataset del enunciado, fuente del seed
│   └── src/
│       ├── ai/                   Cliente del proveedor: request, streaming, reintentos, errores tipados
│       ├── config/               Variables de entorno validadas, DataSource de TypeORM, logger
│       ├── entities/             Entidades de TypeORM (teams, players, sessions, player_sessions, metric_thresholds, ai_reports)
│       ├── migrations/           Esquema inicial y tabla de reportes cacheados
│       ├── middlewares/          Mapeo de errores a HTTP (un solo lugar, reutilizado por el canal SSE)
│       ├── modules/
│       │   ├── sessions/         GET /sessions y GET /sessions/:id/metrics
│       │   ├── reports/          POST /sessions/:id/report y su versión SSE, contexto, validador, caché, prompt versionado
│       │   └── players/          GET /players y POST /players/:id/evolution-report, con su propio prompt
│       ├── seed/                 Carga idempotente del JSON
│       ├── shared/               Enums, errores HTTP y el canal de Server-Sent Events
│       └── test/                 Tests, con la misma estructura que src; los snapshots de los prompts viven junto a su test
└── frontend/
    ├── index.html                Carga de Rubik y favicon
    ├── public/brand/             Logo y marca de OLIVER
    └── src/
        ├── adapters/             Único lugar que conoce el contrato snake_case de la API; devuelve modelos camelCase
        ├── components/           Piezas compartidas entre páginas (sección, estados de feedback, skeleton, contenedor)
        ├── contexts/             Tema de MUI e idioma de la aplicación
        ├── models/               Interfaces y enums del dominio en el cliente
        ├── pages/Dashboard/      La única pantalla: componentes, hooks, styled-components y utilidades propias
        ├── redux/                Store con los servicios de RTK Query
        ├── services/             Endpoints de RTK Query y el canal SSE del reporte
        ├── styled-components/    Estilos compartidos (hero, tarjetas, estados)
        ├── theme/                Paleta, tipografía y overrides de MUI
        ├── translations/         Textos en español e inglés, tipados por una misma interfaz
        └── utilities/            Constantes, tipos, formateadores y helpers sin estado
```

Cada módulo del backend sigue la misma secuencia: `router` → `controller` → `service` → `repository`, con `schemas` (Zod), `mappers`, `types` y `constants` en archivos propios. Cada prompt vive en `prompts/` con su versión, su `CHANGELOG.md` y un test de snapshot que falla ante cualquier cambio de redacción.

En el frontend la regla es servicios → adaptadores → modelos: los componentes sólo renderizan, la lógica vive en hooks, los estilos en styled-components, y constantes, tipos, enums y helpers tienen cada uno su archivo.

## Documentación del proceso

Dos documentos acompañan a este README:

- [docs/FLOW.md](docs/FLOW.md): el recorrido de un reporte con IA, con un diagrama y notas por etapa sobre qué se busca con cada paso y la decisión que hay detrás.
- [docs/PROCESO.md](docs/PROCESO.md): cómo se construyó el proyecto, en qué orden, qué revisiones hubo y qué se aceptó o descartó de cada una, y cómo se verificó cada etapa.

## Consideraciones

- **API key.** Se lee sólo del entorno. `.env` está en `.gitignore`; el repositorio incluye `.env.example` con todas las variables.
- **Cuota gratuita.** Los reportes usan el tier gratuito de Gemini. Si el proveedor devuelve 429, la API responde `AI_RATE_LIMITED` con `retry_after_seconds` cuando lo informa, y la interfaz lo muestra con un botón para reintentar. Cambiar a `gemini-3.5-flash-lite` (con `AI_REASONING_EFFORT=low`) suele destrabar la cuota del día.
- **Caché de reportes.** Un reporte generado se guarda en la tabla `ai_reports` y se vuelve a servir ante la misma petición (sesión o jugador, idioma, audiencia, versión del prompt, modelo y huella de los datos). "Regenerar" fuerza una llamada nueva. Para arrancar con la caché vacía: `delete from ai_reports;`.
- **Idioma.** El conmutador ES / EN del encabezado cambia todos los textos, los formatos de números y fechas, y el idioma en que se piden los reportes. La elección queda guardada en el navegador. Un reporte ya generado en el otro idioma ofrece pedirlo de nuevo en el idioma activo.
- **Puertos.** La base usa el 5433 para no chocar con una instalación local de PostgreSQL; la API el 3080 y el frontend el 5173. Todos se cambian por variables de entorno.
- **Errores de la API.** Siempre tienen la forma `{ "error": { "code", "message", "details?" } }`. Los códigos sobre los que decide la interfaz son `VALIDATION_ERROR`, `NOT_FOUND`, `SESSION_WITHOUT_METRICS`, `PLAYER_WITHOUT_SESSIONS`, `AI_NOT_CONFIGURED`, `AI_TIMEOUT`, `AI_RATE_LIMITED`, `AI_INVALID_RESPONSE` y `AI_PROVIDER_ERROR`.
- **Tests.** `yarn test` en `backend/` corre los tests unitarios de las partes puras (alertas, contexto, validador, caché, cliente del proveedor, prompts). No requieren base de datos ni API key.
- **Versionado.** `backend/CHANGELOG.md` y `frontend/CHANGELOG.md` siguen la versión de cada paquete; cada prompt tiene su propio changelog junto al archivo.

## API

| Método | Ruta                            | Notas                                                                                                                                                             |
| ------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/sessions`                     | Sesiones ordenadas por fecha.                                                                                                                                     |
| `GET`  | `/sessions/:id/metrics`         | `?player_id=`, `?order_by=<métrica>&order=asc\|desc`. Devuelve la sesión, los umbrales del equipo y una fila por jugador. Los nulos van al final.                 |
| `POST` | `/sessions/:id/report`          | Body `{ language: es\|en, audience: coach\|player, force?: boolean }`. Resumen del equipo, hasta tres jugadores destacados con su motivo y las alertas de umbral. |
| `GET`  | `/sessions/:id/report/stream`   | El mismo reporte por Server-Sent Events, con los parámetros en la query string. Eventos: `status`, `summary` (texto acumulado) y al final `report` o `error`.     |
| `GET`  | `/players`                      | Plantel.                                                                                                                                                          |
| `POST` | `/players/:id/evolution-report` | Mismo body que el reporte de sesión. Progresión de un jugador a lo largo de las sesiones.                                                                         |

Ejemplo:

```bash
curl -X POST localhost:3080/sessions/103/report \
  -H 'Content-Type: application/json' \
  -d '{"language":"es","audience":"coach"}'
```

## Modelo de datos

`teams` → `players`, `sessions`, `metric_thresholds`; `player_sessions` guarda las métricas del wearable de un jugador en una sesión (única por `session_id + player_id`). `ai_reports` almacena los reportes generados junto con la huella de los datos que describen. Los ids vienen del JSON para que la API coincida con el dataset. Los umbrales viven en su propia tabla en lugar de una columna JSON, de modo que se pueden consultar y editar por equipo. El esquema es una migración SQL escrita a mano; el seed hace upsert, por lo que puede ejecutarse las veces que haga falta.

## Modelo de IA

Por defecto, **Google Gemini `gemini-3.5-flash`** a través de su endpoint compatible con OpenAI, con `gemini-3.5-flash-lite` como alternativa cuando se agota la cuota gratuita del primero. Los motivos:

- Tiene tier gratuito con API key.
- Ofrece modo JSON nativo (`response_format: json_object`), del que depende la salida estructurada.
- El endpoint compatible con OpenAI hace que el cliente sea agnóstico del proveedor: Groq, OpenRouter o un Ollama local funcionan cambiando `AI_BASE_URL`, `AI_API_KEY` y `AI_MODEL`, sin tocar código.
- El razonamiento está apagado (`AI_REASONING_EFFORT=none`): el modelo no calcula nada, solo redacta a partir de cifras que ya vienen resueltas en el contexto, así que razonar únicamente agrega latencia (unos 22 segundos con razonamiento frente a 2 a 6 sin él, con la misma calidad de texto). `gemini-3.5-flash-lite` rechaza `none`, así que la alternativa usa `low`. En Gemini los tokens de razonamiento se descuentan del mismo límite de salida que la respuesta, de modo que con razonamiento activo el cliente suma al tope de la prosa el margen de `AI_REASONING_TOKENS_ALLOWANCE`; sin ese margen, un razonamiento largo cortaba el JSON de forma intermitente.

La key se obtiene en aistudio.google.com y se configura en `backend/.env`. Se lee solo del entorno.

## Integración con IA

El principio es que **el código decide y el modelo escribe**. En la práctica son tres mecanismos encadenados: el modelo responde en un JSON con forma fija que se valida antes de usarse; un conjunto de reglas determinísticas comprueba cada dato de esa respuesta contra los datos que se le enviaron; y, si algo falla, el modelo recibe su propia respuesta junto con los problemas encontrados y tiene un único intento para corregirla. El modelo nunca es la fuente de verdad de ningún número.

1. **Contexto armado en código** ([`report-context.ts`](backend/src/modules/reports/report-context.ts)). Las alertas de umbral, los promedios del equipo, los líderes por métrica y las listas de jugadores sin RPE o con minutos reducidos (menos del 75 % de la sesión) se calculan antes de que intervenga el modelo, junto con un resumen de las alertas (cuántas por nivel, cuántos jugadores afectados, qué métricas) para que nunca tenga que contar nada. Al modelo le llegan por nombre solo las alertas críticas; las advertencias viajan únicamente como conteo y los umbrales no viajan: lo que el prompt le prohíbe atribuir, directamente no lo ve. El contexto es un único JSON de unos 4 KB, con un glosario de sus campos en el prompt y sin los números de camiseta, que difieren de los ids del dataset.
2. **Prompt versionado** ([`session-report.prompt.ts`](backend/src/modules/reports/prompts/session-report.prompt.ts), [`player-evolution.prompt.ts`](backend/src/modules/players/prompts/player-evolution.prompt.ts)). Rol, glosario de campos, reglas numeradas, bloques por idioma y audiencia y una plantilla JSON de salida. La versión viaja en el `meta` de cada respuesta y forma parte de la clave de caché; cada prompt tiene un `CHANGELOG.md` al lado. Un test de snapshot guarda el prompt renderizado para cada combinación de idioma y audiencia, junto con la temperatura y `max_tokens` ([`session-report.prompt.snap`](backend/src/test/modules/reports/prompts/session-report.prompt.snap)): cualquier cambio falla hasta que se actualizan el snapshot, la versión y el changelog, y otro test comprueba que cada campo del contexto está descrito en el glosario.
3. **Salida estructurada y validación** ([`report-validator.ts`](backend/src/modules/reports/report-validator.ts)). El modelo responde un JSON con `summary` y `highlights`; las alertas nunca se le piden. Cada destacado lleva la métrica y el valor que lo justifican, y el validador comprueba que el jugador existe, que es líder de esa métrica y que el valor es el de ese jugador y no el de otro. Además: nadie puede ser destacado dos veces, todo número de la prosa existe en el contexto (tolerando `10.488`, `10,488` y `29,6`), todo nombre completo pertenece a los datos y ninguna clave JSON aparece en el texto. Si hay menos de dos jugadores comparables, se aceptan menos destacados, hasta una lista vacía.
4. **Un reintento correctivo** ([`model-request.ts`](backend/src/modules/reports/model-request.ts)). Si la respuesta falla, se reproduce como turno del asistente y las violaciones como el siguiente turno del usuario, de modo que el modelo ve qué escribió y qué estuvo mal; tiene exactamente un intento más. Un JSON malformado se informa como tal; una respuesta cortada por `max_tokens` se informa como demasiado larga, y si se cortó casi sin texto, como un límite agotado antes de escribir. Una segunda falla devuelve `502 AI_INVALID_RESPONSE` con las violaciones en `details`. Se prefiere una falla corta y visible a reintentos silenciosos.
5. **Errores del proveedor** ([`openai-compatible.client.ts`](backend/src/ai/openai-compatible.client.ts)). Están tipados y se mapean a HTTP en un solo lugar, donde todo error de servidor queda en el log con su código y sus detalles. Un 5xx transitorio se reintenta hasta dos veces con backoff (1 y 2 segundos), también cuando el proveedor abre el stream con 200 y lo corta con un cuerpo de error en lugar de `[DONE]`, algo que Gemini hace bajo alta demanda. Un 429 no se reintenta: se devuelve con la pista de `retry-after` para que decida el cliente. Un temporizador acota cada llamada (`AI_TIMEOUT_MS`, 30 segundos), por lo que la espera máxima de un reporte es el doble de ese plazo más las pausas del backoff.

Lo observado durante el desarrollo con las versiones actuales de los prompts, sobre el dataset del enunciado: los reportes generados en la última jornada de pruebas (las tres sesiones para el cuerpo técnico en español, la sesión 103 para jugadores en inglés y varios reportes de evolución, con ambos modelos) fueron aceptados al primer intento, sin rechazos del validador por contenido. Todos los rechazos vistos antes fueron del proveedor (razonamiento que agotaba `max_tokens`, streams cortados) y de ahí salieron el margen de tokens y el reintento del stream. Los rechazos por contenido que motivaron reglas del prompt fueron una clave JSON en un resumen en inglés, un `change_pct` literal en una observación y la expresión "alertas de nivel warning"; los tres quedaron cubiertos por el validador o por el prompt.

### Extras implementados

- **Caché.** Los reportes se guardan en `ai_reports` con clave por tipo, sujeto, idioma, audiencia, versión del prompt, modelo y un SHA-256 del contexto enviado al modelo. Una petición idéntica se responde desde la base (`meta.cached: true`) y la interfaz ofrece "Regenerar", que envía `force: true` y reemplaza la fila. Cambiar el prompt, el modelo o los datos invalida la caché por construcción. La lista de alertas se recalcula en cada petición, también cuando el reporte sale de la caché.
- **Streaming.** El endpoint SSE narra el progreso (`status`), empuja el resumen a medida que crece (`summary`, extraído del JSON parcial) y termina con el `report` validado o un `error`. Si el cliente se desconecta, se aborta la llamada al modelo. El endpoint `POST` se mantiene para scripts y tests.
- **Reporte de evolución.** Arma un contexto por sesión con sus alertas críticas, marca las sesiones con minutos reducidos y precalcula, para las cinco métricas de rendimiento, el cambio entre la primera y la última sesión comparables, con los totales proyectados a 90 minutos jugados y la dirección escrita en palabras (`up`, `down`, `flat`), para que el modelo nunca haga aritmética ni lea un signo. RPE y carga no se trendean: son alertas, y un porcentaje sobre una escala de 1 a 10 no dice nada.
- **Tests.** Vitest sobre las partes puras: detección de alertas, líderes y agregados, validador de respuestas, resúmenes de alertas, tendencias, hash de la caché, extractor de resumen parcial, prompts renderizados y cliente del proveedor (reintentos, rate limit, timeout, cancelación, streaming, stream cortado, turnos de reintento, salida truncada).

## Interfaz

Una sola página. La banda del encabezado lleva el logo, el selector de sesión, el conmutador de idioma y cuatro datos calculados en el cliente a partir de las métricas y umbrales cargados (alertas críticas, advertencias, jugadores con minutos reducidos, jugadores sin RPE), de modo que la primera pantalla ya responde cómo fue la sesión. Debajo: la tabla ordenable (el orden se delega a la API), el gráfico de barras con selector de métrica y líneas de umbral, el resaltado de los valores en advertencia o críticos, y una tarjeta con dos pestañas: el reporte de la sesión y la evolución del jugador. Los dos paneles tienen estados de vacío, carga (un esqueleto con la forma del resultado, donde el resumen se escribe a medida que llega), error con reintento y resultado; ambos quedan montados, por lo que cambiar de pestaña no pierde un reporte en curso. Un reporte generado en el otro idioma ofrece pedirlo de nuevo en el idioma activo.

## Decisiones de diseño y trade-offs

- **Express y TypeORM, módulos por recurso.** Tengo más práctica con NestJS, pero su estructura de módulos, decoradores e inyección de dependencias era más de lo que el problema necesitaba. Cada módulo de Express sigue el orden router, controller, service y repository, y se lee de corrido.
- **Las alertas se calculan en código y "superar" es estricto.** Un valor igual al límite no es alerta. En el dataset hay tres valores de RPE exactamente en el límite de advertencia, así que la decisión se nota. La regla está en un único helper con su test, y el frontend resalta con la misma regla.
- **La API usa snake_case.** Es el formato del dataset y de los parámetros de consulta. Los adaptadores del frontend convierten a camelCase.
- **El endpoint de métricas devuelve también los umbrales.** Con una sola petición la interfaz tiene todo lo que necesita para resaltar valores. Un endpoint aparte habría sumado otro estado de carga.
- **El validador comprueba las cifras contra el contexto, no confía en el modelo.** Rechaza, por ejemplo, un porcentaje que el modelo haya calculado por su cuenta, que es el dato inventado que el enunciado quiere evitar. El costo es algún reintento ocasional. Tiene límites conocidos: en el texto libre comprueba que una cifra exista, no que esté bien atribuida (los destacados sí se comprueban contra la fila del propio jugador); los enteros chicos pasan como conteos; un apellido inventado solo no se detecta y en inglés, donde el modelo capitaliza más palabras, puede haber falsos positivos; y no verifica afirmaciones, así que una tendencia descrita al revés pasaría si las cifras existen.
- **Las tendencias se calculan por 90 minutos.** Las sesiones duran 75, 80 y 90 minutos, y comparar totales confunde jugar más tiempo con rendir más. Los totales se llevan a 90 minutos a ritmo constante; la velocidad máxima no se ajusta porque es un pico. Una sesión con menos del 75 % de los minutos queda fuera de la tendencia. El modelo recibe la base, los minutos y el tipo de cada sesión comparada, y debe señalarlo cuando difieren.
- **Las alertas críticas se nombran también para los jugadores.** Aunque el reporte se dirija al grupo, un límite crítico de carga es información de salud que el jugador debe conocer, y la lista de alertas se muestra al lado de todos modos. Las advertencias no se atribuyen a nadie en ninguna audiencia.
- **Los datos entran al prompt sin filtrar.** Nombres, posiciones y títulos de sesión viajan tal como están en la base. El prompt aclara que el JSON son datos y no instrucciones, y la salida se valida campo por campo. En producción habría que limitar el largo y los caracteres de esos campos al cargarlos.
- **El prompt no incluye una respuesta de ejemplo.** Un ejemplo traería cifras que no son de la sesión, justo lo que el validador persigue. La forma de la respuesta se indica con una plantilla JSON cuyos valores describen cada campo.
- **Las filas de jugadores se envían completas.** Son la única fuente de las posiciones y del panorama por jugador. A cambio, tientan al modelo a comparar y derivar cifras, que el validador rechaza. Sin ellas, el resumen sería una paráfrasis de los agregados.
- **La caché es exacta, no semántica.** La entrada es chica y estructurada, y un reporte "parecido" podría traer cifras de otra sesión. Cuesta armar el contexto antes de buscar y una columna de 64 caracteres para el hash.
- **El reporte es una mutación, no una consulta cacheada en el cliente.** Pulsar el botón siempre vuelve a preguntar; si responde la caché del servidor, la respuesta lo dice en `meta.cached`.
- **El streaming lee el resumen del JSON parcial.** Depende de que `summary` sea la primera clave de la respuesta, como fija la plantilla del prompt. Gemini respeta ese orden.
- **Un solo idioma para la aplicación y los reportes.** Se elige una vez en el encabezado y se recuerda en el navegador; el formulario del reporte solo pide la audiencia.

## Qué mejoraría con más tiempo

- Un set de evaluación chico para el prompt: las sesiones del dataset en todas las combinaciones de idioma y audiencia, corrido en cada cambio de versión, con tasa de aceptación al primer intento, motivos de reintento y uso de tokens. Hoy esa evidencia es la de las pruebas manuales descritas más arriba.
- Persistir el contexto exacto enviado al modelo junto con cada reporte, para auditoría y como insumo de esa evaluación.
- Rate limiting y un presupuesto de peticiones en los endpoints de reportes, ya que cada llamada consume cuota del proveedor.
- Paginación y filtros por fecha en `/sessions`, y un `ETag` en `/sessions/:id/metrics`.
- Cobertura end-to-end de los flujos del dashboard y tests de componentes para los estados del panel de reporte.
- Comparar jugadores de la misma posición entre sí, dentro de una sesión y a lo largo de las sesiones, para evaluar el rendimiento por puesto en lugar de contra todo el plantel.

## Herramientas de IA utilizadas

Utilicé Claude Code (Anthropic) como pair programmer durante el desarrollo. Me asistió con el armado del esqueleto de los módulos y las capas del frontend, redactó los tests a partir de los casos borde señalados en el dataset, hizo de revisor del prompt y del validador frente a respuestas reales del modelo, y ejecutó pruebas de punta a punta sobre la API y la interfaz. Las decisiones documentadas en este archivo (umbrales estrictos, qué recibe el modelo, qué comprueba el validador, la política de reintentos, la proyección de las tendencias) las tomé y revisé personalmente; cada cambio generado fue leído antes de quedar, y los prompts se iteraron contra respuestas reales del modelo en lugar de aceptarse tal como estaban. El detalle del proceso, con las revisiones que hubo y lo que se aceptó o descartó de cada una, está en [docs/PROCESO.md](docs/PROCESO.md); el recorrido técnico de un reporte, en [docs/FLOW.md](docs/FLOW.md). La estructura de carpetas, los patrones de diseño, la separación de responsabilidades en el frontend y en el backend y el uso de tipado estricto, entre otras prácticas, también fueron decisiones mías.
