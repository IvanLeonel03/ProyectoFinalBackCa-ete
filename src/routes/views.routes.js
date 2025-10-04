import express from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// Vista principal de productos
router.get('/products', async (req, res) => {
    try {
        const { 
            limit = 10, 
            page = 1, 
            sort, 
            query,
            category,
            available 
        } = req.query;
        
        let filter = {};
        
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }
        
        if (category) {
            filter.category = category;
        }
        
        if (available === 'true') {
            filter.stock = { $gt: 0 };
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true
        };

        if (sort === 'asc' || sort === 'desc') {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const result = await Product.paginate(filter, options);

        // Construir links para la vista
        const buildQueryParams = () => {
            const params = new URLSearchParams();
            if (limit !== '10') params.append('limit', limit);
            if (query) params.append('query', query);
            if (category) params.append('category', category);
            if (available) params.append('available', available);
            if (sort) params.append('sort', sort);
            return params.toString();
        };

        const queryParams = buildQueryParams();
        
        const prevLink = result.hasPrevPage 
            ? `/products?page=${result.prevPage}&${queryParams}`
            : null;
        
        const nextLink = result.hasNextPage 
            ? `/products?page=${result.nextPage}&${queryParams}`
            : null;

        res.render('products', {
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            totalProducts: result.totalDocs,
            prevLink,
            nextLink,
            currentQuery: query || '',
            currentCategory: category || '',
            currentSort: sort || '',
            currentAvailable: available || '',
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { 
            error: 'Error al cargar los productos' 
        });
    }
});

// Vista de detalle de producto
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).render('error', { 
                error: 'Producto no encontrado' 
            });
        }
        res.render('productDetail', { product });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { 
            error: 'Error al cargar el producto' 
        });
    }
});

// Vista del carrito - USA EL MISMO CART ID
router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        let cart = await Cart.findById(cartId).populate('products.product');
        
        if (!cart) {
            // Si el carrito no existe, crear uno nuevo con el mismo ID
            cart = new Cart({ 
                _id: cartId,
                products: [] 
            });
            await cart.save();
            console.log(`🆕 Carrito creado con ID: ${cartId}`);
        }

        console.log(`📦 Carrito cargado: ${cart.products.length} productos`);

        // Calcular total
        const total = cart.products.reduce((sum, item) => {
            if (item.product && item.product.price) {
                return sum + (item.product.price * item.quantity);
            }
            return sum;
        }, 0);

        res.render('cart', { 
            cart,
            total: total.toFixed(2)
        });
    } catch (error) {
        console.error('Error cargando carrito:', error);
        res.status(500).render('error', { 
            error: 'Error al cargar el carrito' 
        });
    }
});

export default router;