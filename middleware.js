export default function middleware(req) {
  const url = new URL(req.url);
  if (url.pathname === '/api/canje') return;
  const cookie = req.headers.get('cookie') || '';
  if (cookie.includes('mirarim_juego=1')) return;
  return new Response('Este juego requiere un acceso vigente de MIRARIM.', { status: 401, headers: { 'Cache-Control': 'no-store' } });
}

export const config = { matcher: ['/((?!api/canje).*)'] };
