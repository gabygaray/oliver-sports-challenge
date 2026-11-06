# Cómo se construyó

Este documento cuenta el camino: en qué orden se hicieron las cosas, qué revisiones hubo, qué se aceptó, qué se descartó y por qué, y cómo se verificó cada etapa. El qué cambió en cada versión está en los changelogs (`backend/CHANGELOG.md`, `frontend/CHANGELOG.md` y uno junto a cada prompt); el cómo funciona el flujo está en [FLOW.md](FLOW.md).

## Forma de trabajo

Trabajé con Claude Code como par durante todo el desarrollo, con una configuración propia que ya usaba antes de este challenge: una skill de buenas prácticas (un archivo por tipo de pieza, componentes y hooks de hasta 250 líneas, lógica en hooks, estilos en styled-components, comentarios de una línea, documentación que describe solo el estado actual) y una skill con las capas y plantillas de mi stack (servicios, adaptadores, modelos en el frontend; router, controller, service, repository en el backend). Además, una memoria de preferencias que el asistente aplica entre sesiones: no commitear sin que yo lo pida, mensajes de commit de una línea en inglés, una sola versión por commit, comentarios cortos.

El reparto fue estable: el asistente propone y escribe, yo decido y reviso. Cada cambio generado se leyó antes de quedar. Las decisiones de diseño de este documento las tomé yo; varias salieron de revisiones externas que pedí a otros modelos de lenguaje y que después discutí con el asistente punto por punto.

## Cronología

### Etapa 1. Lectura del enunciado

Leí el enunciado y el dataset y los analicé, puse atención en qué pedía como obligatorio y como opcional, y dónde estaba la dificultad real, que no era en los endpoints ni en la pantalla sino en que el modelo escriba sin inventar. Recién después se los pasé al asistente, para contrastar esa lectura con la suya y ver si coincidía o si había algo que no había interpretado.

### Etapa 2. Construcción de la base

El proyecto se armó a partir de la seed de frontend de otro proyecto mío y de la estructura de carpetas y prácticas que utilizo habitualmente, con las dos skills cargadas y el enunciado como prioridad. En esa primera pasada quedó la primera versión de lo que luego fuí refinando.

Decisiones que vienen de esa etapa:

- **El modelo.** La API key se creó en Google AI Studio. Los modelos más nuevos del tier gratuito devolvían 503 de forma sostenida; `gemini-3.5-flash` respondía, y quedó como default.
- **Tres correcciones al releer el enunciado contra el código.** El esquema aceptaba un solo destacado cuando el texto pide dos o tres; "superar" un umbral se leía como `>=` y el dataset tiene tres valores exactamente en el límite, puestos a propósito, así que pasó a `>` estricto en backend y frontend; y una regla para los conteos en el texto del modelo.
- **Caché exacta.** Ante la pregunta de si convenía una capa semántica, la respuesta fue que no: la entrada es chica y estructurada, y un reporte "parecido" traería cifras de otra sesión. Quedó la clave por parámetros más el hash del contexto.
- **Limpieza de código.** Tipos en sus archivos, bucles `for (;;)` reemplazados por una forma más legible y una revisión de malas prácticas.
- **Primer diseño de la pantalla** con la skill de diseño de frontend, con la condición de no usar datos de ejemplo: todo sale del dataset.
- **Un documento privado de contexto**, fuera del repositorio, con la descripción completa de lo construido para poder estudiarlo.

### Etapa 3. Entender lo construido

Antes de seguir, leí ese documento haciéndole preguntas rápidas al asistente. Después pedí el listado de las funciones principales. En esa lectura apareció que un 503 del proveedor no se reintentaba; se agregaron tres intentos con espera creciente, sin documentarlo como corrección porque debía haber estado desde el principio.

### Etapa 4. Ida y vuelta sobre la estructura inicial

Antes del primer commit hubo una etapa de ida y vuelta sobre lo implementado, punto por punto: qué recibe el modelo, cómo están armados los prompts, qué comprueba el validador, cómo responde la pantalla. Parte de esa revisión la contrasté con la lectura de otro modelo sobre el mismo código, para ver si las observaciones apuntaban hacia el mismo lado. También quedaron fijadas dos reglas de documentación: cada comentario y cada `.md` describen solo el estado actual, sin referencias al pasado, y los changelogs van por paquete y junto a cada prompt.

Con esa base cerrada se hizo el primer commit y se creó el repositorio en GitHub. Una pasada posterior tomó los puntos que habían quedado pendientes, decidió el README en español y ajustó la pantalla: columna de posición, un icono con la definición de RPE y carga, la leyenda de umbrales con los colores de la tabla, nombres completos en lugar de apellidos, títulos y unidades en los ejes del gráfico, y cada sección como tarjeta para que se distingan.

### Etapa 5. Revisión crítica de la integración con IA

Pedí al asistente una revisión como evaluador senior, con foco en qué recibe el modelo y cómo está armado el prompt. De ahí salieron los cambios de más peso:

- **El modelo recibía datos que el prompt le prohibía usar.** Viajaban las nueve alertas con nombre y la tabla de umbrales, mientras la regla decía "no enumeres ni atribuyas advertencias". Se cambió el contexto para que lleguen solo las alertas críticas con nombre, las advertencias como conteo y ningún umbral.
- **Ningún test miraba el prompt renderizado.** Se agregó un snapshot por combinación de idioma y audiencia, que obliga a subir la versión y el changelog ante cualquier cambio de redacción y deja el prompt legible tal como viaja.
- **La sesión sin alertas no estaba contemplada.** Una frase en la regla correspondiente.
- Pulidos: la regla de porcentajes del prompt de evolución se contradecía en la lectura literal; "vos" aparecía en el bloque de español aunque solo aplica a la audiencia de jugadores; se documentaron la decisión de nombrar alertas críticas a los jugadores y los falsos positivos del chequeo de nombres en inglés.

Descartado a propósito desde el principio, y sostenido en todas las revisiones posteriores: agentes, RAG, `json_schema`, abstracciones de prompt y cambio de proveedor. El enunciado prefiere una base sólida a extras, y ninguno de esos cinco mueve la rúbrica.

### Etapa 6. Errores que no dejaban rastro

Al generar reportes aparecían fallos intermitentes con "la respuesta fue cortada por el límite de salida", y no se veían en el log. Investigarlo mostró dos problemas distintos. El canal SSE responde 200 y emitía el error como evento sin registrarlo en el servidor; se corrigió para que todo error de servidor quede en el log con código y detalles. Y el modelo alternativo (`gemini-3.5-flash-lite`, con razonamiento obligatorio) consumía el presupuesto de salida en razonar, porque Gemini descuenta esos tokens del mismo límite; se agregó un margen configurable por entorno, el log del uso de tokens de razonamiento, y un mensaje de reintento distinto para "se agotó el límite antes de escribir" frente a "la respuesta es demasiado larga".

### Etapa 7. Revisiones externas

Pasé el repositorio por otros modelos de lenguaje cuatro veces, y cada devolución la discutí con el asistente con la consigna de defender lo que estuviera bien y tomar solo lo necesario.

Aceptado:

- Campos del contexto sin entrada en el glosario; se quitaron del contexto y se agregó un test que exige que cada campo esté descrito.
- La versión del prompt no cubría temperatura ni límite de tokens; el snapshot ahora los incluye.
- El streaming no pedía `usage`, y Gemini no lo envía sin el flag; una línea en el cliente.
- Una regla duplicada entre glosario y reglas; se quitó.
- Las tendencias de evolución comparaban totales de sesiones de 75, 80 y 90 minutos, con lo que una sesión más larga parecía progreso. Fue el aporte más valioso de las revisiones: se pasó a proyectar los totales a 90 minutos en código, con la velocidad máxima absoluta y el tipo y los minutos de cada sesión comparada en el contexto.
- Reglas de niveles de alerta, fechas y posiciones por idioma; una línea que declara que el JSON son datos y no instrucciones; `reference_minutes` explícito en cada tendencia para que el "90" que cita el modelo exista en el contexto con cualquier dataset.

Descartado, con el motivo:

- **Un script de evaluación del prompt**, propuesto en las cuatro revisiones. Cada corrida gasta cuota gratuita, que el enunciado pide no gastar y que efectivamente se agotó durante las pruebas manuales. Quedó en "con más tiempo", y el README registra en su lugar lo observado a mano.
- **Reescribir las reglas en positivo y en bloques con título.** La redacción vigente producía reportes correctos; cambiarla sin una evaluación que lo mida es iterar por gusto.
- **Una plantilla única por prompt en lugar de reglas compartidas.** Las reglas compartidas existen porque hubo deriva real entre los dos prompts (la regla de fechas estaba en uno y no en el otro); duplicarlas volvería a abrir esa puerta.
- **Guardar el contexto junto al reporte.** Solo tiene valor como insumo del script de evaluación.

### Etapa 8. Pruebas de punta a punta

Con la API levantada se recorrieron todos los endpoints con casos normales y bordes, se generaron reportes reales en varias combinaciones y se probó el stream. Hallazgos y correcciones:

- **Gemini corta el stream a mitad de camino bajo alta demanda**: responde 200, envía parte del texto y termina con un cuerpo de error 503 en lugar de la marca de fin. El lector lo ignoraba, el texto parcial fallaba como JSON inválido y el reintento le reprochaba al modelo un error del proveedor. Se detecta el cierre sin marca de fin y se trata como error de proveedor, con el reintento cubriendo toda la lectura del stream.
- Un body JSON malformado devolvía 500 en lugar de 400.
- Un parámetro no numérico mostraba "received nan".
- Una sesión con menos de dos jugadores comparables no podía producir reporte, porque el esquema exigía dos destacados; ahora se exigen tantos como permitan los líderes.
- El reporte de evolución enumeraba las ocho métricas con porcentajes, incluido el RPE; se quitaron RPE y carga de las tendencias y el prompt pide elegir las dos o tres más relevantes.
- Un resumen en inglés escribió claves JSON en el texto y una observación escribió `change_pct` literal; el validador rechaza ahora cualquier clave con guion bajo del contexto.

Después se repitió el recorrido desde Chrome: tabla cotejada celda por celda contra la API, orden ascendente y descendente con nulos al final, cambio de sesión, gráfico, estados del reporte (vacío, error por cuota, streaming, caché, regenerar) y evolución. Salieron cuatro detalles visuales (línea de umbral dibujada fuera del eje, "rpe" en minúscula en los chips, un punto duplicado en la línea de meta, desborde horizontal de la tabla) que se corrigieron.

### Etapa 9. Interfaz

Con el comportamiento cerrado, se trabajó la pantalla: el gráfico a todo el ancho y los dos análisis como pestañas en una tarjeta, esqueletos de carga con la forma del resultado para que la tarjeta no cambie de altura, las alertas en una columna a la derecha separadas en críticas y advertencias, y la aplicación completa en español o inglés con el idioma de los reportes atado al de la pantalla, más un botón para pedir de nuevo un reporte que quedó en el otro idioma. Por último, la identidad de OLIVER tomada de su sitio: logo del navbar, paleta y tipografía.

### Etapa 10. Documentación

El README se reescribió desde cero en español, primero con lo general (puesta en marcha, tecnologías, estructura, consideraciones) y después con lo que pide el enunciado. Se revisó frase por frase para que fuera natural y sin voseo, y se agregaron estos dos documentos.

## Política de commits y versiones

El trabajo se commiteó agrupado por tema, no por sesión: base, contexto crítico y snapshots, interfaz (pestañas, esqueletos, columna de alertas, tendencias por 90), idioma, identidad y documentación. Dentro de cada commit, cada artefacto versionado (prompts, paquetes) avanza una sola versión: cuando una etapa iteró varias veces sobre el mismo prompt antes de commitear, las entradas de changelog se fundieron en una y los snapshots se regeneraron con la versión final. Esa regla se fijó a mitad del trabajo; el segundo commit todavía muestra varias versiones de prompt con la misma fecha, y lo dejé así en lugar de reescribir el historial.

## Verificación

Cada etapa cerró con `yarn typecheck`, `yarn lint`, `yarn test` y `yarn build` en los dos paquetes. Los tests cubren las partes puras: alertas, contexto, validador, caché, cliente del proveedor, extractor de resumen parcial y prompts renderizados; no requieren base de datos ni API key. Lo que depende del modelo se verificó a mano contra Gemini, con el detalle de lo observado en el README.
