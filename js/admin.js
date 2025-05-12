document.addEventListener('DOMContentLoaded', () => {
    // Check if admin
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.email !== 'admin@pakstore.pk') {
        window.location.href = 'login.html';
        return;
    }
    
    // Tab switching
    const tabs = document.querySelectorAll('.admin-tabs button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Load products
    loadProducts();
    
    // Load users
    loadUsers();
    
    // Load orders
    loadOrders();
    
    // Add product form
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('product-name').value;
            const price = parseInt(document.getElementById('product-price').value);
            const category = document.getElementById('product-category').value;
            const image = document.getElementById('product-image').value;
            const description = document.getElementById('product-description').value;
            
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            
            products.push({
                id: newId,
                name,
                price,
                category,
                image,
                description
            });
            
            localStorage.setItem('products', JSON.stringify(products));
            loadProducts();
            addProductForm.reset();
            
            alert('Product added successfully!');
        });
    }
    
    function loadProducts() {
        const productsTable = document.getElementById('products-table');
        if (!productsTable) return;
        
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productsTable.innerHTML = '';
        
        products.forEach(product => {
            productsTable.innerHTML += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>PKR ${product.price.toLocaleString()}</td>
                    <td>${product.category}</td>
                    <td>
                        <span class="admin-action edit" data-id="${product.id}">Edit</span>
                        <span class="admin-action delete" data-id="${product.id}">Delete</span>
                    </td>
                </tr>
            `;
        });
        
        // Add event listeners
        document.querySelectorAll('.admin-action.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                alert('Edit functionality would be implemented here');
            });
        });
        
        document.querySelectorAll('.admin-action.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const updatedProducts = products.filter(p => p.id !== productId);
                
                localStorage.setItem('products', JSON.stringify(updatedProducts));
                loadProducts();
            });
        });
    }
    
    function loadUsers() {
        const usersTable = document.getElementById('users-table');
        if (!usersTable) return;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        usersTable.innerHTML = '';
        
        users.forEach(user => {
            if (user.email === 'admin@pakstore.pk') return;
            
            usersTable.innerHTML += `
                <tr>
                    <td>${user.email.substring(0, 6)}...</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>
                        <span class="admin-action delete" data-email="${user.email}">Delete</span>
                    </td>
                </tr>
            `;
        });
        
        // Add event listeners
        document.querySelectorAll('.admin-action.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const userEmail = e.target.getAttribute('data-email');
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const updatedUsers = users.filter(u => u.email !== userEmail);
                
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                loadUsers();
            });
        });
    }
    
    function loadOrders() {
        const ordersTable = document.getElementById('orders-table');
        if (!ordersTable) return;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let allOrders = [];
        
        users.forEach(user => {
            if (user.orders && user.orders.length > 0) {
                allOrders = [...allOrders, ...user.orders];
            }
        });
        
        // Sort by date (newest first)
        allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        ordersTable.innerHTML = '';
        
        allOrders.forEach(order => {
            ordersTable.innerHTML += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer.name}</td>
                    <td>PKR ${order.total.toLocaleString()}</td>
                    <td>${order.status}</td>
                    <td>
                        <span class="admin-action" data-id="${order.id}">View</span>
                        <select class="status-select" data-id="${order.id}">
                            <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                </tr>
            `;
        });
        
        // Add event listeners for status changes
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const orderId = parseInt(e.target.getAttribute('data-id'));
                const newStatus = e.target.value;
                
                const users = JSON.parse(localStorage.getItem('users')) || [];
                
                users.forEach(user => {
                    if (user.orders) {
                        user.orders.forEach(order => {
                            if (order.id === orderId) {
                                order.status = newStatus;
                            }
                        });
                    }
                });
                
                localStorage.setItem('users', JSON.stringify(users));
            });
        });
    }
});