// Helpers para Handlebars
export default {
    // Formatear precio
    formatPrice: (price) => {
        if (!price && price !== 0) return '$ 0.00';
        const num = parseFloat(price);
        if (isNaN(num)) return '$ 0.00';
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(num);
    },

    // Multiplicar
    multiply: (a, b) => {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        return numA * numB;
    },

    // Comparaciones
    eq: (a, b) => a === b,
    gt: (a, b) => (parseFloat(a) || 0) > (parseFloat(b) || 0),
    lt: (a, b) => (parseFloat(a) || 0) < (parseFloat(b) || 0),
    gte: (a, b) => (parseFloat(a) || 0) >= (parseFloat(b) || 0),
    lte: (a, b) => (parseFloat(a) || 0) <= (parseFloat(b) || 0),

    // Lógicos
    and: (a, b) => a && b,
    or: (a, b) => a || b,

    // Matemáticas
    inc: (value) => (parseInt(value) || 0) + 1,
    dec: (value) => (parseInt(value) || 0) - 1
};