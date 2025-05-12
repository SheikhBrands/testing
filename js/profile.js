document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === currentUser.email);
    
    if (!user) {
        logout();
        return;
    }
    
    // Display user info
    const userInfo = document.getElementById('user-info');
    userInfo.innerHTML = `
        <div class="user-detail">
            <label>Full Name</label>
            <span>${user.name}</span>
        </div>
        <div class="user-detail">
            <label>Email</label>
            <span>${user.email}</span>
        </div>
        <div class="user-detail">
            <label>Phone</label>
            <span>${user.phone}</span>
        </div>
    `;
    
    // Display orders
    const ordersList = document.getElementById('orders-list');
    if (user.orders && user.orders.length > 0) {
        user.orders.reverse().forEach(order => {
            ordersList.innerHTML += `
                <div class="order-item-history">
                    <p><strong>Order #${order.id}</strong> - ${new Date(order.date).toLocaleDateString()}</p>
                    <p>${order.items.length} items - PKR ${order.total.toLocaleString()}</p>
                    <p>Status: ${order.status}</p>
                </div>
            `;
        });
    } else {
        ordersList.innerHTML = '<p>No orders yet</p>';
    }
    
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            alert('Profile editing functionality would be implemented here');
        });
    }
});