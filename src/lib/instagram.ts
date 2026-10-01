// Instagram en dos sabores intercambiables:
//  A) Behold.so: si existe BEHOLD_FEED_URL, se lee el feed JSON al compilar.
//  B) Respaldo: los links de src/data/instagram.json, mostrados con el embed oficial.
// Si A falla por cualquier motivo, se usa B sin romper la compilación.
import respaldo from '../data/instagram.json';

export interface PublicacionBehold {
  id: string;
  enlace: string;
  imagen: string;
  ancho?: number;
  alto?: number;
  texto: string;
  esVideo: boolean;
}

export type FeedInstagram =
  | { fuente: 'behold'; publicaciones: PublicacionBehold[] }
  | { fuente: 'embeds'; enlaces: string[] };

const MAXIMO = 12;

function recortar(texto: string, largo = 120): string {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  return limpio.length > largo ? `${limpio.slice(0, largo).replace(/\s+\S*$/, '')}…` : limpio;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizar(post: any): PublicacionBehold | null {
  const tamano = post?.sizes?.medium ?? post?.sizes?.large ?? post?.sizes?.small;
  const imagen = tamano?.mediaUrl ?? post?.thumbnailUrl ?? post?.mediaUrl;
  if (!post?.permalink || !imagen) return null;
  return {
    id: String(post.id ?? post.permalink),
    enlace: post.permalink,
    imagen,
    ancho: tamano?.width,
    alto: tamano?.height,
    texto: recortar(post.prunedCaption ?? post.caption ?? ''),
    esVideo: post.mediaType === 'VIDEO',
  };
}

export async function cargarInstagram(): Promise<FeedInstagram> {
  const url = import.meta.env.BEHOLD_FEED_URL ?? process.env.BEHOLD_FEED_URL;
  if (url) {
    try {
      const respuesta = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      const datos = await respuesta.json();
      // Behold entrega un arreglo (formato antiguo) o un objeto con "posts".
      const lista: unknown[] = Array.isArray(datos) ? datos : (datos?.posts ?? []);
      const publicaciones = lista.map(normalizar).filter((p): p is PublicacionBehold => p !== null).slice(0, MAXIMO);
      if (publicaciones.length > 0) return { fuente: 'behold', publicaciones };
      console.warn('[instagram] El feed de Behold vino vacío; se usan los embeds de respaldo.');
    } catch (error) {
      console.warn(`[instagram] No se pudo leer BEHOLD_FEED_URL (${(error as Error).message}); se usan los embeds de respaldo.`);
    }
  }
  // Los links de ejemplo (con "EJEMPLO") se ignoran: la sección muestra una invitación a seguir la cuenta.
  const enlaces = respaldo.posts
    .filter((p) => /^https:\/\/(www\.)?instagram\.com\/(p|reel)\//.test(p) && !/ejemplo/i.test(p))
    .slice(0, MAXIMO);
  return { fuente: 'embeds', enlaces };
}
