document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    const cartEmpty = document.getElementById('cart-empty');
    const cartItems = document.getElementById('cart-items');
    const cartTableBody = document.getElementById('cart-table-body');
    const cartTotal = document.getElementById('cart-total');
    
    loadCart();
    
    function loadCart() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const users = getUsersArray();
        const user = users.find(u => u.email === currentUser.email);
        const cart = user ? user.cart || [] : [];
        
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartItems.style.display = 'none';
            return;
        }
        
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        
        cartTableBody.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartTableBody.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>PKR ${item.price.toLocaleString()}</td>
                    <td>
                        <div class="quantity-control">
                            <button class="decrease" data-id="${item.id}">-</button>
                            <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="increase" data-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td>PKR ${itemTotal.toLocaleString()}</td>
                    <td><span class="remove-item" data-id="${item.id}">Remove</span></td>
                </tr>
            `;
        });
        
        cartTotal.textContent = total.toLocaleString();
        
        // Add event listeners
        addCartEventListeners();
    }
    
    function addCartEventListeners() {
        // Decrease quantity
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                updateCartQuantity(productId, -1);
            });
        });
        
        // Increase quantity
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                updateCartQuantity(productId, 1);
            });
        });
        
        // Manual quantity input
        document.querySelectorAll('.quantity-control input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const newQuantity = parseInt(e.target.value);
                
                if (isNaN(newQuantity) || newQuantity < 1) {
                    e.target.value = 1;
                    updateCartQuantity(productId, 0, 1); // Set to 1 if invalid
                    return;
                }
                
                updateCartQuantity(productId, 0, newQuantity); // Set specific quantity
            });
        });
        
        // Remove item
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                removeCartItem(productId);
            });
        });
    }
    
    function updateCartQuantity(productId, change, specificQuantity = null) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const users = getUsersArray();
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex === -1) return;
        
        const cartItem = users[userIndex].cart.find(item => item.id === productId);
        
        if (cartItem) {
            if (specificQuantity !== null) {
                cartItem.quantity = specificQuantity;
            } else {
                cartItem.quantity += change;
                
                // Ensure quantity doesn't go below 1
                if (cartItem.quantity < 1) {
                    cartItem.quantity = 1;
                }
            }
            
            saveUsersArray(users);
            loadCart(); // Refresh the cart display
            updateCartCount();
        }
    }
    
    function removeCartItem(productId) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const users = getUsersArray();
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex === -1) return;
        
        // Filter out the item to be removed
        users[userIndex].cart = users[userIndex].cart.filter(item => item.id !== productId);
        
        saveUsersArray(users);
        loadCart(); // Refresh the cart display
        updateCartCount();
        
        // Show empty cart message if no items left
        if (users[userIndex].cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartItems.style.display = 'none';
        }
    }
});