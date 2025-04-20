function switchTab(tab) {
    // Përditëso butonat
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Përditëso format
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    if (tab === 'login') {
        document.getElementById('login-form').classList.add('active');
    } else {
        document.getElementById('register-form').classList.add('active');
    }
}

// Funksioni për regjistrim
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Fjalëkalimet nuk përputhen!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Kontrollo nëse ekziston përdoruesi
    if (users.some(user => user.email === email)) {
        alert('Ky email është i regjistruar tashmë!');
        return;
    }

    const user = {
        name,
        email,
        password,
        orders: []
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Regjistrimi u krye me sukses! Tani mund të hyni në llogarinë tuaj.');
    switchTab('login');
    
    // Pastro format e regjistrimit
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm-password').value = '';
}

// Funksioni për hyrje
// Funksioni për hyrje
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Shto një parameter në URL për të treguar që vjen nga login
        window.location.href = 'index.html?fromLogin=true';
    } else {
        alert('Email ose fjalëkalim i gabuar!');
    }
}

// Event listeners
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('register-form').addEventListener('submit', handleRegister);

// Kontrollo nëse ka përdorues të kyçur
window.onload = function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
};