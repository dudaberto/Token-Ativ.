// Função para fazer login (simulando a chamada à API)
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulação da chamada à API que retorna o token
    const mockApiResponse = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiRnVsYW5vIGRhIFNpbHZhIiwiYXZhdGFyIjoiaHR0cHM6Ly9jZG4taWNvbnMtcG5nLmZsYXRpY29uLmNvbS8xMjgvMTMyNi8xMzI2Mzc3LnBuZyIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxNjE2MjQwMjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    };
    
    localStorage.setItem('jwtToken', mockApiResponse.token);
    
    showUserProfile();
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function showUserProfile() {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('profile').style.display = 'none';
        return;
    }
    
    const decoded = parseJwt(token);
    
    if (decoded) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('profile').style.display = 'flex';
        document.getElementById('username').textContent = decoded.name;
        document.getElementById('avatar').src = decoded.avatar;
    }
}

function logout() {
    localStorage.removeItem('jwtToken');
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('profile').style.display = 'none';
}

window.onload = function() {
    showUserProfile();
};