// robots.txt generado según "indexarEnGoogle" de src/data/sitio.json.
import type { APIRoute } from 'astro';
import sitio from '../data/sitio.json';

export const GET: APIRoute = ({ site }) => {
  const reglas = sitio.indexarEnGoogle
    ? ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('sitemap-index.xml', site)}`]
    : ['User-agent: *', 'Disallow: /'];
  return new Response(reglas.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
