require('dotenv').config();
const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.json()); // para entender JSON no corpo das requisições

app.post('/usuarios', async (req, res) => {
  const nome = req.body.nome;
  if (!nome) {
    return res.status(400).json({ erro: 'Nome é obrigatório' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const resultado = await client.query(
      'INSERT INTO usuarios (nome) VALUES ($1) RETURNING *',
      [nome]
    );

    await client.end();

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

//login local
app.post('/login', async (req, res) => {
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});