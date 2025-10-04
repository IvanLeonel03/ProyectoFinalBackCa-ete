// test-cart.js - Para probar la funcionalidad del carrito
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/ecommerce';

async function testCart() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Obtener un producto de prueba
        const Product = mongoose.model('Product');
        const products = await Product.find().limit(1);
        
        if (products.length === 0) {
            console.log('❌ No hay productos en la base de datos');
            return;
        }

        const testProduct = products[0];
        console.log(`📦 Producto de prueba: ${testProduct.title} (${testProduct._id})`);

        // Probar la API del carrito directamente
        const cartId = '68e143d384b21d7415c60298';
        const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${testProduct._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: 1 })
        });

        const result = await response.json();
        console.log('🔧 Respuesta de la API:', result);

        if (result.status === 'success') {
            console.log('✅ API del carrito funciona correctamente');
        } else {
            console.log('❌ Error en la API:', result.message);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Ejecutar solo si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    testCart();
}