// src/utils/helpers.js
export const helpers = {
    // Multiplicar dos números
    multiply: (a, b) => {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        return numA * numB;
    },
    
    // Formatear precio
    formatPrice: (price) => {
        const numPrice = parseFloat(price) || 0;
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numPrice);
    },
    
    // Verificar igualdad
    eq: (a, b) => a === b,
    
    // Mayor que
    gt: (a, b) => {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        return numA > numB;
    },
    
    // Menor que
    lt: (a, b) => {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        return numA < numB;
    },
    
    // Menor o igual que
    lte: (a, b) => {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        return numA <= numB;
    },
    
    // Mayor o igual que
    gte: (a, b) => {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        return numA >= numB;
    },
    
    // Y lógico
    and: (a, b) => a && b,
    
    // O lógico
    or: (a, b) => a || b,
    
    // Incrementar
    inc: (value) => {
        const num = parseInt(value) || 0;
        return num + 1;
    },
    
    // Decrementar
    dec: (value) => {
        const num = parseInt(value) || 0;
        return num - 1;
    },
    
    // Verificar si un array tiene elementos
    hasItems: (array) => {
        return Array.isArray(array) && array.length > 0;
    }
};