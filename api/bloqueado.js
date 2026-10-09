export default function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(401).send('Este juego requiere un acceso vigente de MIRARIM.');
}
