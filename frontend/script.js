const API_URL = 'https://gerenciador-tarefas-fullstack.onrender.com';

let todasTarefas = [];
let filtroAtual = 'Todas';

document.addEventListener('DOMContentLoaded', () => {
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');
  const authForm = document.getElementById('auth-form');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const groupNome = document.getElementById('group-nome');
  const authBtn = document.getElementById('auth-btn');
  const toggleAuth = document.getElementById('toggle-auth');
  const toggleMsg = document.getElementById('toggle-msg');
  const formTarefa = document.getElementById('form-tarefa');
  const categoriaFiltros = document.getElementById('categoria-filtros');

  const btnToggleSenha = document.getElementById('btn-toggle-senha');
  const inputSenha = document.getElementById('senha');
  const iconToggleSenha = document.getElementById('icon-toggle-senha');

  let isLoginMode = true;

  if (btnToggleSenha && inputSenha && iconToggleSenha) {
    btnToggleSenha.addEventListener('click', () => {
      const isPassword = inputSenha.getAttribute('type') === 'password';
      inputSenha.setAttribute('type', isPassword ? 'text' : 'password');

      iconToggleSenha.classList.toggle('bi-eye', !isPassword);
      iconToggleSenha.classList.toggle('bi-eye-slash', isPassword);
    });
  }

  const resetSenhaInput = () => {
    if (inputSenha) inputSenha.setAttribute('type', 'password');
    if (iconToggleSenha) {
      iconToggleSenha.classList.remove('bi-eye-slash');
      iconToggleSenha.classList.add('bi-eye');
    }
  };

  if (toggleAuth) {
    toggleAuth.addEventListener('click', (e) => {
      e.preventDefault();
      isLoginMode = !isLoginMode;

      resetSenhaInput(); 

      if (isLoginMode) {
        authTitle.textContent = 'DevConnect';
        authSubtitle.textContent = 'Gerencie suas tarefas de dev em um só lugar';
        groupNome.classList.add('d-none');
        authBtn.textContent = 'Entrar na plataforma';
        toggleMsg.textContent = 'Não possui conta?';
        toggleAuth.textContent = 'Cadastre-se';
      } else {
        authTitle.textContent = 'Criar Conta';
        authSubtitle.textContent = 'Preencha seus dados para se cadastrar';
        groupNome.classList.remove('d-none');
        authBtn.textContent = 'Cadastrar Conta';
        toggleMsg.textContent = 'Já tem uma conta?';
        toggleAuth.textContent = 'Faça Login';
      }
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value.trim();
      const nome = document.getElementById('nome') ? document.getElementById('nome').value.trim() : '';

      if (!email || !senha) {
        alert('Por favor, preencha o e-mail e a senha.');
        return;
      }
      
      const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
      const payload = isLoginMode ? { email, senha } : { nome, email, senha };

      try {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
          alert('Atenção: ' + (data.mensagem || 'Credenciais inválidas!'));
          return;
        }

        if (isLoginMode) {
          localStorage.setItem('token', data.token);
          checkAuthStatus();
        } else {
          alert('Cadastro realizado com sucesso! Faça login.');
          toggleAuth.click();
        }
      } catch (error) {
        alert('Não foi possível conectar ao backend! Verifique se ele está rodando.');
      }
    });
  }

  if (formTarefa) {
    formTarefa.addEventListener('submit', async (e) => {
      e.preventDefault();

      const titulo = document.getElementById('nomeTarefa').value.trim();
      const categoria = document.getElementById('categoriaTarefa').value;
      const token = localStorage.getItem('token');

      if (!titulo) return;

      try {
        // CORRIGIDO: Adicionado /api/tasks
        const res = await fetch(`${API_URL}/api/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ titulo, categoria })
        });

        if (!res.ok) {
          alert('Erro ao criar tarefa!');
          return;
        }

        document.getElementById('nomeTarefa').value = '';
        carregarTarefas();
      } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
      }
    });
  }

  if (categoriaFiltros) {
    categoriaFiltros.addEventListener('click', (e) => {
      const btnTarget = e.target.closest('button');
      if (btnTarget) {
        Array.from(categoriaFiltros.children).forEach(btn => btn.classList.remove('active'));
        btnTarget.classList.add('active');
        filtroAtual = btnTarget.getAttribute('data-filter');
        aplicarFiltroERenderizar();
      }
    });
  }

  checkAuthStatus();
});

function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');

  if (token) {
    if (authScreen) authScreen.classList.add('d-none');
    if (appScreen) appScreen.classList.remove('d-none');
    carregarTarefas();
  } else {
    if (authScreen) authScreen.classList.remove('d-none');
    if (appScreen) appScreen.classList.add('d-none');
  }
}

function logout() {
  localStorage.removeItem('token');
  checkAuthStatus();
}

async function carregarTarefas() {
  const token = localStorage.getItem('token');
  try {
    // CORRIGIDO: Adicionado /api/tasks
    const res = await fetch(`${API_URL}/api/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      logout();
      return;
    }

    todasTarefas = await res.json();
    atualizarEstatisticas();
    aplicarFiltroERenderizar();
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
  }
}

function atualizarEstatisticas() {
  const statTotal = document.getElementById('stat-total');
  const statPending = document.getElementById('stat-pending');
  const statCompleted = document.getElementById('stat-completed');

  if (statTotal) statTotal.textContent = todasTarefas.length;
  if (statPending) statPending.textContent = todasTarefas.filter(t => !t.concluida).length;
  if (statCompleted) statCompleted.textContent = todasTarefas.filter(t => t.concluida).length;
}

function aplicarFiltroERenderizar() {
  let tarefasFiltradas = todasTarefas;
  if (filtroAtual !== 'Todas') {
    tarefasFiltradas = todasTarefas.filter(t => t.categoria === filtroAtual);
  }
  renderizarTarefas(tarefasFiltradas);
}

function obterBadgeCategoria(categoria) {
  switch (categoria) {
    case 'Trabalho':
      return `<span class="badge bg-warning-subtle text-warning-emphasis fw-medium px-2 py-1"><i class="bi bi-briefcase me-1"></i>Trabalho</span>`;
    case 'Pessoal':
      return `<span class="badge bg-info-subtle text-info-emphasis fw-medium px-2 py-1"><i class="bi bi-person me-1"></i>Pessoal</span>`;
    case 'Estudos':
    default:
      return `<span class="badge bg-primary-subtle text-primary fw-medium px-2 py-1"><i class="bi bi-journal-bookmark me-1"></i>Estudos</span>`;
  }
}

function renderizarTarefas(tarefas) {
  const listaTarefas = document.getElementById('lista-tarefas');
  if (!listaTarefas) return;

  listaTarefas.innerHTML = '';

  if (tarefas.length === 0) {
    listaTarefas.innerHTML = `<p class="text-muted text-center py-4 mb-0">Nenhuma tarefa encontrada.</p>`;
    return;
  }

  tarefas.forEach(t => {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center p-3 mb-2 ${t.concluida ? 'task-done-bg' : ''}`;
    
    const idTarefa = t.id || t._id;
    const badgeHTML = obterBadgeCategoria(t.categoria);

    li.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <button type="button" class="btn btn-action ${t.concluida ? 'btn-success' : 'btn-outline-secondary'} btn-toggle-status" data-id="${idTarefa}" data-status="${t.concluida}" title="Marcar como concluída">
          <i class="bi ${t.concluida ? 'bi-check-lg' : 'bi-circle'}"></i>
        </button>
        <span class="${t.concluida ? 'task-done' : 'fw-medium'}">${t.titulo}</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        ${badgeHTML}
        <button type="button" class="btn btn-action btn-outline-danger btn-deletar" data-id="${idTarefa}" title="Excluir tarefa">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    listaTarefas.appendChild(li);
  });

  document.querySelectorAll('.btn-toggle-status').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const statusAtual = btn.getAttribute('data-status') === 'true';
      toggleStatusTarefa(id, statusAtual);
    });
  });

  document.querySelectorAll('.btn-deletar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      deletarTarefa(id);
    });
  });
}

async function toggleStatusTarefa(id, statusAtual) {
  const token = localStorage.getItem('token');
  try {
    // CORRIGIDO: Adicionado /api/tasks
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ concluida: !statusAtual })
    });

    if (!res.ok) {
      const resPatch = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ concluida: !statusAtual })
      });

      if (!resPatch.ok) {
        alert('Não foi possível atualizar o status da tarefa.');
        return;
      }
    }

    carregarTarefas();
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
  }
}

async function deletarTarefa(id) {
  if (!confirm('Deseja realmente excluir esta tarefa?')) return;

  const token = localStorage.getItem('token');
  try {
    // CORRIGIDO: Adicionado /api/tasks
    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    carregarTarefas();
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
  }
}
