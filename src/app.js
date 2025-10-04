import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Conectar a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error MongoDB:', err));

// Importar helpers
const helpers = await import('./utils/hbsHelpers.js').then(module => module.default);

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine({
    helpers: helpers,
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Importar y usar rutas
const productRoutes = (await import('./routes/api/products.routes.js')).default;
const cartRoutes = (await import('./routes/api/carts.routes.js')).default;
const viewsRoutes = (await import('./routes/views.routes.js')).default;

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', viewsRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.redirect('/products');
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).render('error', { 
        error: 'Página no encontrada',
        message: 'La página que buscas no existe.'
    });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).render('error', { 
        error: 'Error interno del servidor',
        message: 'Algo salió mal. Por favor, intenta más tarde.'
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
    console.log(`🛍️  Productos: http://localhost:${PORT}/products`);
    console.log(`🔧 API: http://localhost:${PORT}/api/products`);
});