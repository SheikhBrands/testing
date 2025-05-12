document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Tab switching
    if (loginTab && registerTab && loginForm && registerForm) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });
        
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        });
    }
    
    // Login form submission
    const loginFormSubmit = document.getElementById('login-form-submit');
    if (loginFormSubmit) {
        loginFormSubmit.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Safely get users array
            const users = getUsersArray();
            
            // Find user with matching credentials
            const user = Array.isArray(users) 
                ? users.find(u => u && u.email === email && u.password === password)
                : null;
            
            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
                
                alert('Login successful!');
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }
    
    // Register form submission
    const registerFormSubmit = document.getElementById('register-form-submit');
    if (registerFormSubmit) {
        registerFormSubmit.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            
            // Validate inputs
            if (!validateRegistration(name, email, phone, password, confirm)) {
                return;
            }
            
            // Safely get users array
            const users = getUsersArray();
            
            // Check if user already exists
            const userExists = Array.isArray(users) 
                ? users.some(u => u && u.email === email)
                : false;
            
            if (userExists) {
                alert('Email already registered');
                return;
            }
            
            // Add new user
            const newUser = {
                name,
                email,
                phone,
                password,
                cart: [],
                orders: [],
                isAdmin: false
            };
            
            users.push(newUser);
            saveUsersArray(users);
            
            // Auto-login
            sessionStorage.setItem('currentUser', JSON.stringify({
                name,
                email
            }));
            
            alert('Registration successful!');
            window.location.href = 'index.html';
        });
    }
    
    // Helper function to safely get users array
    function getUsersArray() {
        try {
            const usersJson = localStorage.getItem('users');
            if (!usersJson) {
                return [];
            }
            const parsed = JSON.parse(usersJson);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Error reading users from localStorage:', e);
            return [];
        }
    }
    
    // Helper function to safely save users array
    function saveUsersArray(users) {
        try {
            localStorage.setItem('users', JSON.stringify(Array.isArray(users) ? users : []));
        } catch (e) {
            console.error('Error saving users to localStorage:', e);
        }
    }
    
    // Validation function
    function validateRegistration(name, email, phone, password, confirm) {
        // Validate phone number format (Pakistani)
        const phoneRegex = /^03\d{2}-\d{7}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid Pakistani phone number in format 03XX-XXXXXXX');
            return false;
        }
        
        if (password !== confirm) {
            alert('Passwords do not match');
            return false;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return false;
        }
        
        if (!name || !email) {
            alert('Please fill in all required fields');
            return false;
        }
        
        return true;
    }
});