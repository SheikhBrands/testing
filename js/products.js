document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Load all products
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Display all products initially
    displayProducts(products);
    
    // Category filter functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            const category = button.dataset.category;
            filterProducts(category, searchInput.value.toLowerCase());
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', () => {
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        filterProducts(activeCategory, searchInput.value.toLowerCase());
    });
    
    function filterProducts(category, searchTerm = '') {
        let filteredProducts = products;
        
        // Apply category filter
        if (category !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }
        
        // Apply search filter
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        displayProducts(filteredProducts);
    }
    
    // Replace the displayProducts function in products.js with this:
function displayProducts(productsToDisplay) {
    productsGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy" 
                     onerror="this.src='assets/images/products/default.jpg'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${formatCategory(product.category)}</p>
                <p class="product-price">PKR ${product.price.toLocaleString()}</p>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Initialize lazy loading and verify images
    loadAndVerifyImages();

        
        // Add event listeners to new buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!checkAuth()) return;
                
                const productId = e.target.getAttribute('data-id');
                const product = products.find(p => p.id == productId);
                
                if (product) {
                    addToCart(product);
                    updateCartCount();
                    
                    // Button click animation
                    e.target.classList.add('clicked');
                    setTimeout(() => {
                        e.target.classList.remove('clicked');
                    }, 300);
                    
                    alert(`${product.name} added to cart!`);
                }
            });
        });
    }
    
    function formatCategory(category) {
        const formatted = {
            'electronics': 'Electronics',
            'clothing': 'Clothing',
            'home': 'Home & Living',
            'beauty': 'Beauty'
        };
        return formatted[category] || category;
    }
});

// Add this new function to products.js
function loadAndVerifyImages() {
    const images = document.querySelectorAll('.product-card img');
    
    images.forEach(img => {
        // Check if image loads successfully
        img.onload = function() {
            this.style.opacity = 1;
        };
        
        img.onerror = function() {
            this.src = 'assets/images/products/default.jpg';
            this.style.opacity = 1;
        };
        
        // If image is already in cache, trigger load manually
        if (img.complete) {
            img.dispatchEvent(new Event('load'));
        }
    });
}

// Add this to your existing products.js
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// Call this after loading products
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    // Add this at the end
    lazyLoadImages();
});