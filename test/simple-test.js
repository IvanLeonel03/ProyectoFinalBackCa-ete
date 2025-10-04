// test/simple-test.js - VERSIÓN ALTERNATIVA
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const products = [
    {
        title: "iPhone 14 Pro",
        description: "Smartphone Apple última generación",
        price: 1299.99,
        category: "electronics",
        stock: 10,
        code: "IPHONE14",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/3498db/ffffff?text=iPhone"]
    },
    {
        title: "Samsung Galaxy S23", 
        description: "Smartphone Android premium",
        price: 899.99,
        category: "electronics",
        stock: 15,
        code: "SGS23",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/3498db/ffffff?text=Galaxy"]
    },
    {
        title: "Nike Air Max",
        description: "Zapatillas deportivas cómodas",
        price: 129.99,
        category: "clothing", 
        stock: 20,
        code: "NIKEAIR",
        status: true,
        thumbnails: ["https://via.placeholder.com/400x300/e74c3c/ffffff?text=Nike"]
    }
];

async function simpleTest() {
    try {
        console.log('🔗 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Limpiar base de datos
        await mongoose.connection.db.dropDatabase();
        console.log('🗑️  Base de datos limpiada');

        // Crear modelos directamente
        const Product = mongoose.model('Product', new mongoose.Schema({
            title: String,
            description: String,
            price: Number,
            category: String,
            stock: Number,
            code: String,
            status: Boolean,
            thumbnails: [String]
        }));

        const Cart = mongoose.model('Cart', new mongoose.Schema({
            products: [{
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: Number
            }]
        }));

        // Insertar productos
        console.log('📦 Insertando productos...');
        const createdProducts = await Product.insertMany(products);
        console.log(`✅ ${createdProducts.length} productos insertados`);

        // Crear carrito
        console.log('🛒 Creando carrito...');
        const cart = new Cart({
            products: [
                { product: createdProducts[0]._id, quantity: 2 },
                { product: createdProducts[1]._id, quantity: 1 }
            ]
        });
        await cart.save();
        console.log(`✅ Carrito creado: ${cart._id}`);

        console.log('\n🎯 URLs PARA PROBAR:');
        console.log('   http://localhost:8080/products');
        console.log('   http://localhost:8080/carts/' + cart._id);
        console.log('   http://localhost:8080/api/products');
        console.log('   http://localhost:8080/health');

        await mongoose.connection.close();
        console.log('\n✅ LISTO! Ejecuta: npm run dev');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

simpleTest();