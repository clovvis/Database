'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const passwordForm = document.getElementById('passwordForm');
  const generatePasswordBtn = document.getElementById('generatePassword');
  const showPasswordBtn = document.getElementById('showPassword');
  const passwordInput = document.getElementById('password');
  const searchInput = document.getElementById('searchInput');
  const passwordList = document.getElementById('passwordList');

  let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
  renderPasswordList();

  //Salvar nova senha
  passwordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const service = document.getElementById('service').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const notes = document.getElementById('notes').value;

    const newPassword = {
      id: Date.now(),
      service,
      username,
      password,
      notes,
      createdAt: new Date().toISOString(),
    };
    passwords.push(newPassword);
    savePasswords();
    renderPasswordList();
    passwordForm.reset();
  });

  // Gerar senha aleatória
  generatePasswordBtn.addEventListener('click', function () {
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let generatedPassword = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    passwordInput.value = generatedPassword; // Corrigido: nome da variável
  });

  //Mostrar/ocultar senha
  showPasswordBtn.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      showPasswordBtn.textContent = 'Ocultar';
    } else {
      passwordInput.type = 'password';
      showPasswordBtn.textContent = 'Mostrar';
    }
  });

  //Pesquisar senha
  searchInput.addEventListener('input', function () {
    renderPasswordList();
  });

  //Função para salvar senhas no localStorage
  function savePasswords() {
    localStorage.setItem('passwords', JSON.stringify(passwords));
  }
  //Função para renderizar a lista de senhas
  function renderPasswordList() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPasswords = passwords.filter(
      password =>
        password.service.toLowerCase().includes(searchTerm) ||
        password.username.toLowerCase().includes(searchTerm) ||
        (password.notes && password.notes.toLowerCase().includes(searchTerm)),
    );

    passwordList.innerHTML =
      filteredPasswords.length === 0 ? '<p>Nenhuma senha encontrada.</p>' : '';

    filteredPasswords.forEach(password => {
      const passwordItem = document.createElement('div');
      passwordItem.className = 'password-item';
      passwordItem.setAttribute('data-id', password.id);

      passwordItem.innerHTML = `
                <h3>${password.service}</h3>
                <p><strong>Usuário:</strong> ${password.username}</p>
                <p><strong>Senha:</strong> <span class="hidden-password">••••••••</span></p>
                ${password.notes ? `<p><strong>Observações:</strong> ${password.notes}</p>` : ''}
                <p><small>Criado em: ${new Date(password.createdAt).toLocaleString()}</small></p>
                <div class="password-actions">
                <button class="show-password-btn" data-id="${password.id}">Mostrar Senha</button>
                <button class="copy-btn" data-id="${password.id}" data-type="username">Copiar Usuário</button>
                <button class="copy-btn" data-id="${password.id}" data-type="password">Copiar Senha</button>
                <button class="delete-btn" data-id="${password.id}">Excluir</button>
                </div>
                <div class="real-password" data-id="${password.id}" style="display: none;">${password.password}</div>
                `;

      passwordList.appendChild(passwordItem);
    });

    //Adicionar eventos aos botões
    document.querySelectorAll('.show-password-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = parseInt(this.getAttribute('data-id'));
        const passwordElement = document.querySelector(
          `.real-password[data-id="${id}"]`,
        );
        const hiddenElement = document.querySelector(
          `.password-item[data-id="${id}"] .hidden-password`,
        );

        if (passwordElement.style.display === 'none') {
          passwordElement.style.display = 'block';
          hiddenElement.style.display = 'none';
          this.textContent = 'Ocultar Senha';
        } else {
          passwordElement.style.display = 'none';
          hiddenElement.style.display = 'inline';
          this.textContent = 'Mostrar Senha';
        }
      });
    });

    //Adicionar eventos para botões de copiar
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = parseInt(this.getAttribute('data-id'));
        const type = this.getAttribute('data-type');
        const password = passwords.find(p => p.id === id);

        if (type === 'username') {
          navigator.clipboard.writeText(password.username);
        } else {
          navigator.clipboard.writeText(password.password);
        }
        alert('Copiado para a área de transferência!');
      });
    });

    //Adicionar eventos para botões de excluir
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = parseInt(this.getAttribute('data-id'));
        passwords = passwords.filter(password => password.id !== id);
        savePasswords();
        renderPasswordList();
      });
    });
  }

  // Salvar senhar no localStorage
  function savePasswords() {
    localStorage.setItem('passwords', JSON.stringify(passwords));
  }
});
