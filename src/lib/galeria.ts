// Fotos de la galería: todo lo que esté en src/assets/galeria/, ordenado por nombre de archivo.
// La descripción (alt) de cada foto se escribe en src/data/galeria.json.
import type { ImageMetadata } from 'astro';
import datos from '../data/galeria.json';

const archivos = import.meta.glob<{ default: ImageMetadata }>('../assets/galeria/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

const descripciones: Record<string, string> = datos.fotos;

export interface FotoGaleria {
  archivo: string;
  imagen: ImageMetadata;
  alt: string;
}

export const fotosGaleria: FotoGaleria[] = Object.entries(archivos)
  .map(([ruta, modulo]) => {
    const archivo = ruta.split('/').pop() ?? ruta;
    return {
      archivo,
      imagen: modulo.default,
      alt: descripciones[archivo] ?? 'Foto del equipo UC Providencia',
    };
  })
  .sort((a, b) => a.archivo.localeCompare(b.archivo));
