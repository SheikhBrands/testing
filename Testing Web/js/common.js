// USER DATA HELPER FUNCTIONS (to be used across all files)
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

function saveUsersArray(users) {
    try {
        localStorage.setItem('users', JSON.stringify(Array.isArray(users) ? users : []));
    } catch (e) {
        console.error('Error saving users to localStorage:', e);
    }
}

// PRODUCT DATA HELPER FUNCTIONS
function getProductsArray() {
    try {
        const productsJson = localStorage.getItem('products');
        if (!productsJson) {
            return [];
        }
        const parsed = JSON.parse(productsJson);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error('Error reading products from localStorage:', e);
        return [];
    }
}

function saveProductsArray(products) {
    try {
        localStorage.setItem('products', JSON.stringify(Array.isArray(products) ? products : []));
    } catch (e) {
        console.error('Error saving products to localStorage:', e);
    }
}

// Check authentication status
function checkAuth() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Update navigation based on auth status
function updateNav() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const userGreeting = document.getElementById('user-greeting');
    const profileLink = document.getElementById('profile-link');
    const adminLink = document.getElementById('admin-link');
    
    if (currentUser) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        userGreeting.style.display = 'inline';
        userGreeting.textContent = `Hi, ${currentUser.name.split(' ')[0]}`;
        profileLink.style.display = 'inline';
        
        if (currentUser.email === 'admin@pakstore.pk') {
            adminLink.style.display = 'inline';
        } else {
            adminLink.style.display = 'none';
        }
    } else {
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        userGreeting.style.display = 'none';
        profileLink.style.display = 'none';
        adminLink.style.display = 'none';
    }
}

// Update cart count
function updateCartCount() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const cartCount = document.getElementById('cart-count');
    
    if (currentUser) {
        const users = getUsersArray();
        const user = users.find(u => u.email === currentUser.email);
        const cart = user ? user.cart || [] : [];
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    } else {
        cartCount.textContent = '0';
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    updateNav();
    updateCartCount();
    window.location.href = 'login.html';
}

// Add to cart function
function addToCart(product) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return false;
    
    const users = getUsersArray();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex === -1) return false;
    
    const user = users[userIndex];
    user.cart = user.cart || [];
    
    // Check if product already in cart
    const existingItem = user.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    users[userIndex] = user;
    saveUsersArray(users);
    updateCartCount();
    return true;
}

// Initialize sample data if not exists
function initializeSampleData() {
    const users = getUsersArray();
    if (users.length === 0) {
        users.push({
            name: "Admin User",
            email: "admin@pakstore.pk",
            phone: "03001234567",
            password: "admin123",
            cart: [],
            orders: [],
            isAdmin: true
        });
        saveUsersArray(users);
    }
    
    const products = getProductsArray();
    if (products.length === 0) {
        products.push(
            {
                id: 1,
                name: "Samsung Galaxy S21",
                price: 149999,
                category: "electronics",
                image: "assets/images/products/samsung-s21.jpg",
                description: "Latest Samsung smartphone with 5G capability"
            },
            {
                id: 2,
                name: "iPhone 13 Pro",
                price: 219999,
                category: "electronics",
                image: "assets/images/products/iphone-13.jpg",
                description: "Apple's flagship smartphone with A15 Bionic chip"
            },
            {
                id: 3,
                name: "Nishat Linen Shalwar Kameez",
                price: 8999,
                category: "clothing",
                image: "assets/images/products/nishat-linen.jpg",
                description: "Premium quality linen shalwar kameez"
            },
            {
                id: 4,
                name: "Khaadi Kurta",
                price: 5999,
                category: "clothing",
                image: "assets/images/products/khaadi-kurta.jpg",
                description: "Traditional Pakistani kurta with modern design"
            },
            {
                id: 5,
                name: "Dawlance Refrigerator",
                price: 89999,
                category: "home",
                image: "assets/images/products/dawlance-fridge.jpg",
                description: "Energy efficient refrigerator with frost-free technology"
            },
            {
                id: 6,
                name: "whitening Cream",
                price: 2499,
                category: "beauty",
                image: "https://skincarepakistan.com/cdn/shop/files/SWWhiteningCream.jpg?v=1726647962",
                description: "Skin whitening cream with SPF protection"
            }
        );
        saveProductsArray(products);
    }
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sample data
    initializeSampleData();
    
    // Initialize navigation
    updateNav();
    updateCartCount();
    
    // Set up logout link
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Highlight active tab
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    navLinksAll.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});