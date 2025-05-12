document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === currentUser.email);
    const cart = user ? user.cart || [] : [];
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        window.location.href = 'products.html';
        return;
    }
    
    // Load order summary
    const orderItems = document.getElementById('order-items');
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        orderItems.innerHTML += `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>PKR ${itemTotal.toLocaleString()}</span>
            </div>
        `;
    });
    
    const shipping = 200;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = subtotal.toLocaleString();
    document.getElementById('shipping').textContent = shipping.toLocaleString();
    document.getElementById('total').textContent = total.toLocaleString();
    
    // Pre-fill user info
    document.getElementById('full-name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;
    
    // Place order
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const payment = document.getElementById('payment').value;
            
            // Create order
            const order = {
                id: Date.now(),
                date: new Date().toISOString(),
                customer: {
                    name: fullName,
                    email,
                    phone,
                    address,
                    city
                },
                items: [...cart],
                paymentMethod: payment,
                subtotal,
                shipping,
                total,
                status: 'Processing'
            };
            
            // Update user's orders
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            
            if (userIndex !== -1) {
                users[userIndex].orders = users[userIndex].orders || [];
                users[userIndex].orders.push(order);
                users[userIndex].cart = []; // Clear cart
                
                localStorage.setItem('users', JSON.stringify(users));
                sessionStorage.setItem('currentOrder', JSON.stringify(order));
                updateCartCount();
                
                window.location.href = 'profile.html';
            }
        });
    }
});