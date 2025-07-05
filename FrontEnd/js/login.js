document.getElementById('entrar').addEventListener('click', async () => {
  const nome = document.getElementById('nome').value;
  const id = document.getElementById('id').value;

  if (!nome || !id) {
    alert('Preencha todos os campos.');
    return;
  }

  try {
    const response = await fetch('https://teste-api-xi.vercel.app/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, id })
    });

    const data = await response.json();

    if (response.ok && data.auth) {
      localStorage.setItem('autenticado', 'true');  // Define login
      window.location.href = 'cadastro.html';       // Redireciona para cadastro
    } else {
      alert('Credenciais inválidas.');
    }
  } catch (err) {
    alert('Erro ao conectar com o servidor.');
    console.error(err);
  }
});
