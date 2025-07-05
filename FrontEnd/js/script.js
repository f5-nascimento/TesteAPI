if (localStorage.getItem('autenticado') !== 'true') {
  alert('Acesso não autorizado.');
  window.location.href = 'index.html'; // redireciona para login
}


const apiUrl = 'https://teste-api-xi.vercel.app/usuarios';


document.getElementById('cadastrar').addEventListener('click', async () => {
  const nome = document.getElementById('nome').value;

  if (!nome) {
    alert('Por favor, digite um nome.');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome })
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Usuário ${data.nome} cadastrado com sucesso!`);
      document.getElementById('nome').value = '';
    } else {
      const error = await response.json();
      alert(`Erro ao cadastrar: ${error.error}`);
    }
  } catch (err) {
    alert('Erro ao conectar com o servidor.');
    console.error(err);
  }
});
