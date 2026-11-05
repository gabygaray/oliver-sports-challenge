/** RTK Query sets this status when the request never reached the server. */
export const FETCH_ERROR_STATUS = 'FETCH_ERROR';

export const UNKNOWN_ERROR_CODE = 'UNKNOWN';

/** Raised client-side when the SSE connection drops before the final event. */
export const STREAM_ERROR_CODE = 'STREAM_ERROR';

export const API_ERROR_MESSAGES: Record<string, string> = {
  [FETCH_ERROR_STATUS]:
    'No se pudo conectar con el servidor. Revisá que la API esté corriendo.',
  NOT_FOUND: 'No encontramos la sesión seleccionada.',
  VALIDATION_ERROR: 'La consulta enviada no es válida.',
  SESSION_WITHOUT_METRICS:
    'La sesión no tiene métricas cargadas para generar un reporte.',
  PLAYER_WITHOUT_SESSIONS: 'El jugador no tiene sesiones registradas.',
  [STREAM_ERROR_CODE]:
    'Se perdió la conexión con el servidor mientras se generaba el reporte.',
  AI_NOT_CONFIGURED: 'El servicio de IA no está configurado en el servidor.',
  AI_TIMEOUT: 'El modelo tardó demasiado en responder. Probá de nuevo.',
  AI_RATE_LIMITED:
    'Se alcanzó el límite de uso del modelo. Esperá unos segundos y reintentá.',
  AI_INVALID_RESPONSE:
    'El modelo no pudo generar un reporte consistente con los datos. Reintentá.',
  AI_PROVIDER_ERROR: 'El proveedor de IA no está disponible en este momento.',
  [UNKNOWN_ERROR_CODE]: 'Ocurrió un error inesperado. Probá de nuevo.',
};
