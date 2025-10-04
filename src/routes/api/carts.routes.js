import express from 'express';
import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';

const router = express.Router();

// POST /api/carts - Crear nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        
        res.status(201).json({
            status: 'success',
            payload: newCart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
            .populate('products.product');
            
        if (!cart) {
            return res.status(404).json({
                status: 'error', 
                message: 'Carrito no encontrado'
            });
        }

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST /api/carts/:cid/products/:pid
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity = 1 } = req.body;
        const cart = await Cart.findById(req.params.cid);
        const product = await Product.findById(req.params.pid);

        if (!cart || !product) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito o producto no encontrado'
            });
        }

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(
            item => item.product.toString() === req.params.pid
        );

        if (existingProductIndex !== -1) {
            // Incrementar cantidad si ya existe
            cart.products[existingProductIndex].quantity += parseInt(quantity);
        } else {
            // Agregar nuevo producto
            cart.products.push({
                product: req.params.pid,
                quantity: parseInt(quantity)
            });
        }

        await cart.save();
        
        res.json({
            status: 'success',
            message: 'Producto agregado al carrito',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// DELETE /api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Carrito no encontrado' 
            });
        }

        cart.products = cart.products.filter(item => 
            item.product.toString() !== req.params.pid
        );

        await cart.save();
        
        res.json({ 
            status: 'success',
            message: 'Producto eliminado del carrito', 
            payload: cart 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

// PUT /api/carts/:cid
router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body;
        const cart = await Cart.findById(req.params.cid);
        
        if (!cart) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Carrito no encontrado' 
            });
        }

        // Validar estructura de productos
        if (!Array.isArray(products)) {
            return res.status(400).json({
                status: 'error',
                message: 'Products debe ser un array'
            });
        }

        cart.products = products;
        await cart.save();

        res.json({ 
            status: 'success',
            message: 'Carrito actualizado', 
            payload: cart 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

// PUT /api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findById(req.params.cid);
        
        if (!cart) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Carrito no encontrado' 
            });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                status: 'error',
                message: 'La cantidad debe ser un número mayor a 0'
            });
        }

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === req.params.pid
        );

        if (productIndex === -1) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Producto no encontrado en el carrito' 
            });
        }

        cart.products[productIndex].quantity = parseInt(quantity);
        await cart.save();

        res.json({ 
            status: 'success',
            message: 'Cantidad actualizada', 
            payload: cart 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

// DELETE /api/carts/:cid
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Carrito no encontrado' 
            });
        }

        cart.products = [];
        await cart.save();

        res.json({ 
            status: 'success',
            message: 'Todos los productos eliminados del carrito', 
            payload: cart 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

export default router;