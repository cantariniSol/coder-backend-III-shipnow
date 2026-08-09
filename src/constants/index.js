const DOCUMENT_TYPES = Object.freeze({
    DNI: "DNI",
    CUIT: "CUIT",
    CUIL: "CUIL",
    PASSPORT: "PASSPORT"
});

// Roles de usuario
const USER_ROLES = Object.freeze({
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    SELLER: 'SELLER',
    SUPPORT: 'SUPPORT'
});

// Estados del producto
const PRODUCT_STATUS = Object.freeze({
    AVAILABLE: 'AVAILABLE',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
    DISCONTINUED: 'DISCONTINUED',
    COMING_SOON: 'COMING_SOON'
});

// Categorías de productos
const PRODUCT_CATEGORIES = Object.freeze({
    HOGAR: 'hogar',
    JARDIN: 'jardin',
    OFICINA: 'oficina',
    BAÑO: 'baño',
    COCINA: 'cocina',
    VESTIDOR: 'vestidor',
    GAREAGE: 'gareage',
    LAVADERO: 'lavadero'
});

// Estados de órdenes
const ORDER_STATUS = Object.freeze({
    CREATED: 'created',
    ASSIGNED: 'assigned',
    PICKED_UP: 'picked_up',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
});

// Prioridades de órdenes
const ORDER_PRIORITY = Object.freeze({
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high'
});

export {
    DOCUMENT_TYPES,
    PRODUCT_STATUS,
    PRODUCT_CATEGORIES,
    USER_ROLES,
    ORDER_STATUS,
    ORDER_PRIORITY
};