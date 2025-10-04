import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    },
    category: { 
        type: String, 
        required: true,
        enum: ['electronics', 'clothing', 'home', 'sports', 'books'],
        index: true 
    },
    stock: { 
        type: Number, 
        required: true,
        min: 0 
    },
    code: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true 
    },
    status: { 
        type: Boolean, 
        default: true 
    },
    thumbnails: { 
        type: [String], 
        default: [] 
    }
}, { 
    timestamps: true 
});

productSchema.index({ price: 1 });
productSchema.index({ category: 1, price: 1 });

productSchema.plugin(mongoosePaginate);

// Evitar overwrite error
export default mongoose.models.Product || mongoose.model('Product', productSchema);