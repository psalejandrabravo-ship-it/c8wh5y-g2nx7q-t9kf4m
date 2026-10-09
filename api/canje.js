export default async function handler(req, res) {
  const pase = req.query.t || '';
  const secreto = process.env.MIRARIM_LAUNCH_SECRET;
  if (!pase || !secreto) return res.status(403).send('Acceso no disponible');
  const respuesta = await fetch('https://www.mirarim.cl/api/juegos/canjear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-mirarim-secret': secreto },
    body: JSON.stringify({ pase }),
  });
  const data = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok || !data.ok) return res.status(403).send('El permiso no es válido o ya fue usado');
  res.setHeader('Set-Cookie', 'mirarim_juego=1; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=43200');
  res.setHeader('Cache-Control', 'no-store');
  return res.redirect('/');
}
