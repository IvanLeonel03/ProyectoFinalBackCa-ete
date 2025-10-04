import express from 'express';
import Product from '../../models/Product.js';

const router = express.Router();

// GET /api/products con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { 
            limit = 10, 
            page = 1, 
            sort, 
            query,
            category,
            available 
        } = req.query;
        
        // Construir filtro
        let filter = {};
        
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ];
        }
        
        if (category) {
            filter.category = category;
        }
        
        if (available === 'true') {
            filter.stock = { $gt: 0 };
        }

        // Configurar opciones
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
            customLabels: {
                docs: 'payload',
                totalDocs: 'totalProducts'
            }
        };

        // Configurar ordenamiento
        if (sort === 'asc' || sort === 'desc') {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        // Realizar consulta
        const result = await Product.paginate(filter, options);

        // Construir links
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
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
            ? `${baseUrl}?page=${result.prevPage}&${queryParams}`
            : null;
        
        const nextLink = result.hasNextPage 
            ? `${baseUrl}?page=${result.nextPage}&${queryParams}`
            : null;

        // Respuesta estructurada
        const response = {
            status: 'success',
            payload: result.payload,
            totalPages: result.totalPages,
            prevPage: result.prevPage || null,
            nextPage: result.nextPage || null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink,
            nextLink,
            totalProducts: result.totalProducts
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Producto no encontrado' 
            });
        }
        res.json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

export default router;