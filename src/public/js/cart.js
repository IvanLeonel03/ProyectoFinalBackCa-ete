const CART_ID = '68e143d384b21d7415c60298';

// Función global para agregar al carrito
async function addToCart(productId, quantity = 1) {
    try {
        console.log(`🛒 Agregando producto ${productId} al carrito ${CART_ID}...`);
        
        const response = await fetch(`/api/carts/${CART_ID}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: parseInt(quantity) })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification('✅ Producto agregado al carrito', 'success');
            console.log('✅ Producto agregado exitosamente');
            // Actualizar contador del carrito
            updateCartCounter();
        } else {
            showNotification('❌ Error: ' + result.message, 'error');
            console.error('❌ Error:', result.message);
        }
    } catch (error) {
        console.error('❌ Error de red:', error);
        showNotification('❌ Error de conexión', 'error');
    }
}

// Función para agregar desde detalle
async function addToCartDetail(productId) {
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput?.value) || 1;
    
    if (quantity < 1) {
        showNotification('❌ La cantidad debe ser mayor a 0', 'error');
        return;
    }
    
    await addToCart(productId, quantity);
}

// Funciones para gestionar el carrito
async function updateQuantity(cartId, productId, newQuantity) {
    if (newQuantity < 1) return;
    
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification('✅ Cantidad actualizada', 'success');
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showNotification('❌ Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error al actualizar cantidad', 'error');
    }
}

function updateQuantityInput(cartId, productId, value) {
    const quantity = parseInt(value);
    if (quantity > 0) {
        updateQuantity(cartId, productId, quantity);
    }
}

async function removeFromCart(cartId, productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification('✅ Producto eliminado del carrito', 'success');
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showNotification('❌ Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error al eliminar producto', 'error');
    }
}

async function clearCart(cartId) {
    if (!confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification('✅ Carrito vaciado', 'success');
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showNotification('❌ Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error al vaciar carrito', 'error');
    }
}

function checkout(cartId) {
    showNotification('🚀 Redirigiendo al proceso de pago...', 'success');
    setTimeout(() => {
        alert('Esta funcionalidad de pago está en desarrollo');
    }, 1500);
}

// Actualizar contador del carrito
async function updateCartCounter() {
    try {
        const response = await fetch(`/api/carts/${CART_ID}`);
        const result = await response.json();
        
        if (result.status === 'success') {
            const totalItems = result.payload.products.reduce((total, item) => total + item.quantity, 0);
            const cartCounter = document.getElementById('cart-counter');
            
            if (cartCounter) {
                cartCounter.textContent = totalItems;
                cartCounter.style.display = totalItems > 0 ? 'inline-block' : 'none';
            }
        }
    } catch (error) {
        console.error('Error actualizando contador:', error);
    }
}

// Mostrar notificación
function showNotification(message, type) {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Hacer las funciones globales
window.addToCart = addToCart;
window.addToCartDetail = addToCartDetail;
window.updateQuantity = updateQuantity;
window.updateQuantityInput = updateQuantityInput;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.checkout = checkout;
window.updateCartCounter = updateCartCounter;

console.log('🛒 Cart.js cargado correctamente - CART ID:', CART_ID);