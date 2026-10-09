export default async function handler(req, res) {
  const pase = req.query.t || '';
  if (!pase) return res.status(403).send('Acceso no disponible');
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.MIRARIM_LAUNCH_SECRET) headers['x-mirarim-secret'] = process.env.MIRARIM_LAUNCH_SECRET;
  const respuesta = await fetch('https://www.mirarim.cl/api/juegos/canjear', {
    method: 'POST',
    headers,
    body: JSON.stringify({ pase }),
  });
  const data = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok || !data.ok) return res.status(403).send('El permiso no es válido o ya fue usado');
  res.setHeader('Set-Cookie', 'mirarim_juego=1; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=43200');
  res.setHeader('Cache-Control', 'no-store');
  return res.redirect('/');
}
