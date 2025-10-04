import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true,
        default: 1,
        min: 1,
        max: 100 
    }
});

const cartSchema = new mongoose.Schema({
    products: [cartItemSchema]
}, { 
    timestamps: true 
});

// Método para calcular total
cartSchema.methods.calculateTotal = async function() {
    await this.populate('products.product');
    return this.products.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
};

// Evitar overwrite error
export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);