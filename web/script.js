document.addEventListener('DOMContentLoaded', function() {
    // Verifica em qual página estamos
    if (document.getElementById('loginForm')) {
        setupLoginPage();
    } else if (document.getElementById('logoutBtn')) {
        setupHomePage();
    }
});

// Configura a página de login
function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const user = document.getElementById('user').value;
        const psw = document.getElementById('psw').value;
        
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, psw })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Armazena o token no localStorage
                localStorage.setItem('jwtToken', data.token);
                
                // Redireciona para a página home
                window.location.href = 'home.html';
            } else {
                alert('Login falhou: ' + (data.message || 'Credenciais inválidas'));
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao conectar com o servidor');
        }
    });
}

// Configura a página home
function setupHomePage() {
    const logoutBtn = document.getElementById('logoutBtn');
    const postsContainer = document.getElementById('postsContainer');
    
    // Verifica se há token no localStorage
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Decodifica o token para obter informações do usuário
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Usuário logado:', payload.name);
    } catch (error) {
        console.error('Erro ao decodificar token:', error);
        localStorage.removeItem('jwtToken');
        window.location.href = 'login.html';
    }
    
    // Carrega os posts
    loadPosts(token);
    
    // Configura o botão de logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('jwtToken');
        window.location.href = 'login.html';
    });
}

// Função para carregar os posts da API
async function loadPosts(token) {
    try {
        const response = await fetch('http://localhost:3000/posts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const posts = await response.json();
            displayPosts(posts);
        } else if (response.status === 401) {
            // Token inválido ou expirado
            localStorage.removeItem('jwtToken');
            window.location.href = 'login.html';
        } else {
            console.error('Erro ao carregar posts:', response.status);
        }
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
    }
}

// Função para exibir os posts na página
function displayPosts(posts) {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <div class="date">${formatDate(post.date)}</div>
            <p>${post.summary}</p>
            <div class="stats">👁️ ${post.views} | ❤️ ${post.likes}</div>
        `;
        
        postsContainer.appendChild(postElement);
    });
}

// Função para formatar a data
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}