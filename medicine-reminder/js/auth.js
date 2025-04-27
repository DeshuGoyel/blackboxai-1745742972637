// User Authentication and Session Management
class Auth {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.checkSession();
        this.setupLoginForm();
        this.setupRegisterForm();
    }

    // Check if there's an active session
    checkSession() {
        const user = localStorage.getItem('user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.isAuthenticated = true;
            this.redirectToDashboard();
        }
    }

    // Setup login form event listeners
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                this.login(email, password);
            });
        }
    }

    // Setup register form event listeners
    setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                this.register({ name, email, password });
            });
        }
    }

    // Register new user
    register(userData) {
        try {
            if (!userData.email || !userData.password || !userData.name) {
                this.showError('Please fill in all required fields');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(user => user.email === userData.email)) {
                this.showError('Email already registered');
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                name: userData.name,
                email: userData.email,
                password: this.hashPassword(userData.password),
                created: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            this.login(userData.email, userData.password);
        } catch (error) {
            this.showError('Registration failed');
            console.error('Registration error:', error);
        }
    }

    // Login user
    login(email, password) {
        try {
            if (!email || !password) {
                this.showError('Please enter email and password');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email);

            if (!user || user.password !== this.hashPassword(password)) {
                this.showError('Invalid email or password');
                return;
            }

            const sessionUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            localStorage.setItem('user', JSON.stringify(sessionUser));
            this.currentUser = sessionUser;
            this.isAuthenticated = true;
            this.redirectToDashboard();
        } catch (error) {
            this.showError('Login failed');
            console.error('Login error:', error);
        }
    }

    // Logout user
    logout() {
        localStorage.removeItem('user');
        this.currentUser = null;
        this.isAuthenticated = false;
        window.location.href = 'index.html';
    }

    // Show error message
    showError(message) {
        const errorDiv = document.getElementById('authError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 3000);
        } else {
            alert(message);
        }
    }

    // Redirect to dashboard
    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }

    // Simple password hashing (for demo purposes only)
    hashPassword(password) {
        return btoa(password);
    }
}

// Initialize authentication
const auth = new Auth();

// Add logout functionality to button if it exists
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.logout();
        });
    }
});
