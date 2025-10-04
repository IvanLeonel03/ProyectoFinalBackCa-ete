// test/test.js - VERSIÓN CORREGIDA
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// Datos de ejemplo
const sampleProducts = [
    {
        title: "iPhone 14 Pro",
        description: "El último smartphone de Apple con Dynamic Island y cámara profesional",
        price: 1299.99,
        category: "electronics",
        stock: 25,
        code: "IPHONE14PRO",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/3498db/ffffff?text=iPhone+14+Pro"]
    },
    {
        title: "Samsung Galaxy S23",
        description: "Smartphone Android de alta gama con pantalla Dynamic AMOLED",
        price: 899.99,
        category: "electronics",
        stock: 30,
        code: "SGS23",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/3498db/ffffff?text=Samsung+Galaxy+S23"]
    },
    {
        title: "Nike Air Max 270",
        description: "Zapatillas deportivas con tecnología Air Max para máxima comodidad",
        price: 129.99,
        category: "clothing",
        stock: 50,
        code: "NIKEAIRMAX270",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/e74c3c/ffffff?text=Nike+Air+Max+270"]
    },
    {
        title: "MacBook Pro 16 M2",
        description: "Laptop profesional con chip M2, ideal para creativos y desarrolladores",
        price: 2399.99,
        category: "electronics",
        stock: 15,
        code: "MBP16M2",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/3498db/ffffff?text=MacBook+Pro+16"]
    },
    {
        title: "Camiseta Básica Algodón",
        description: "Camiseta de algodón 100% premium, disponible en múltiples colores",
        price: 19.99,
        category: "clothing",
        stock: 100,
        code: "TSHIRT-BASIC",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/e74c3c/ffffff?text=Camiseta+Basica"]
    },
    {
        title: "Auriculares Sony WH-1000XM4",
        description: "Auriculares noise cancelling con sonido de alta fidelidad",
        price: 349.99,
        category: "electronics",
        stock: 20,
        code: "SONYWH1000XM4",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/3498db/ffffff?text=Sony+Headphones"]
    },
    {
        title: "Libro Clean Code",
        description: "Guía esencial de Robert C. Martin para escribir código limpio",
        price: 39.99,
        category: "books",
        stock: 35,
        code: "CLEANCODE-BOOK",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/2ecc71/ffffff?text=Clean+Code"]
    },
    {
        title: "Pelota de Fútbol Oficial",
        description: "Pelota tamaño 5 profesional para partidos y entrenamientos",
        price: 29.99,
        category: "sports",
        stock: 40,
        code: "SOCCERBALL-PRO",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/f39c12/ffffff?text=Pelota+Futbol"]
    },
    {
        title: "Jarra de Vidrio 1L",
        description: "Jarra de vidrio templado para agua y bebidas, capacidad 1 litro",
        price: 15.99,
        category: "home",
        stock: 60,
        code: "GLASS-JAR-1L",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/9b59b6/ffffff?text=Jarra+Vidrio"]
    },
    {
        title: "Teclado Mecánico Gaming",
        description: "Teclado mecánico RGB con switches azules para gaming",
        price: 89.99,
        category: "electronics",
        stock: 0,
        code: "MECH-KEYBOARD",
        status: false,
        thumbnails: ["https://via.placeholder.com/400x300/3498db/ffffff?text=Teclado+Gaming"]
    }
];

async function testDatabase() {
    try {
        console.log('🔗 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Limpiar colecciones existentes
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        console.log('🗑️  Colecciones limpiadas');

        // Importar modelos
        const Product = (await import('../src/models/Product.js')).default;
        const Cart = (await import('../src/models/Cart.js')).default;

        console.log('📦 Insertando productos de ejemplo...');
        const products = await Product.insertMany(sampleProducts);
        console.log(`✅ ${products.length} productos insertados`);

        // Crear carrito de ejemplo
        console.log('🛒 Creando carrito de ejemplo...');
        const cart = new Cart({
            products: [
                { product: products[0]._id, quantity: 2 },
                { product: products[1]._id, quantity: 1 },
                { product: products[2]._id, quantity: 3 },
                { product: products[5]._id, quantity: 1 }
            ]
        });
        await cart.save();
        console.log(`✅ Carrito creado con ID: ${cart._id}`);

        // Mostrar resumen
        console.log('\n📊 BASE DE DATOS LISTA:');
        console.log(`📦 Productos: ${products.length}`);
        console.log(`🛒 Carritos: 1`);
        console.log(`🔗 Carrito ID: ${cart._id}`);
        
        console.log('\n🎯 URLs PARA PROBAR:');
        console.log(`   http://localhost:8080/products`);
        console.log(`   http://localhost:8080/carts/${cart._id}`);
        console.log(`   http://localhost:8080/api/products`);
        console.log(`   http://localhost:8080/health`);

        console.log('\n📝 PRODUCTOS CREADOS:');
        products.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.title} - $${product.price} (${product.category})`);
        });

        await mongoose.connection.close();
        console.log('\n✅ PRUEBA COMPLETADA! Ejecuta: npm run dev');

    } catch (error) {
        console.error('❌ Error en la prueba:', error);
        process.exit(1);
    }
}

testDatabase();// src/public/js/cart.js
// Funciones para manejar el carrito de compras