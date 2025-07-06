const { Client } = require('pg');

module.exports = async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', 'https://dedalobuilders.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, id } = req.body;

  if (!nome || !id) {
    return res.status(400).json({ error: 'Nome e ID são obrigatórios' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const result = await client.query(
      'SELECT * FROM usuarios WHERE nome = $1 AND id = $2',
      [nome, id]
    );

    await client.end();

    if (result.rows.length === 1) {
      return res.status(200).json({ auth: true, user: result.rows[0] });
    } else {
      return res.status(401).json({ auth: false, error: 'Credenciais inválidas' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
