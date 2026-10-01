// Fechas siempre en hora de Chile continental, sin importar dónde se compile el sitio.
export const ZONA = 'America/Santiago';

/** Diferencia (en minutos) entre la hora de Chile y UTC en un instante dado. */
function desfaseChile(instante: Date): number {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(instante);
  const v = (t: string) => Number(partes.find((p) => p.type === t)?.value);
  const comoUtc = Date.UTC(v('year'), v('month') - 1, v('day'), v('hour'), v('minute'));
  return Math.round((comoUtc - instante.getTime()) / 60000);
}

/** Convierte "2026-10-03" + "10:30" (hora de Chile) en un Date real. */
export function fechaChile(fecha: string, hora = '00:00'): Date {
  const [a, m, d] = fecha.split('-').map(Number);
  const [h, min] = (/^\d{1,2}:\d{2}$/.test(hora) ? hora : '00:00').split(':').map(Number);
  const aproximada = new Date(Date.UTC(a, m - 1, d, h, min));
  return new Date(aproximada.getTime() - desfaseChile(aproximada) * 60000);
}

export function formatoFecha(fecha: Date, opciones: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('es-CL', { timeZone: ZONA, ...opciones }).format(fecha);
}

export const conMayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);
