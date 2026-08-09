import { faker } from '@faker-js/faker';
import UserModel from "../models/users.model.js";
import StoreModel from "../models/stores.model.js";
import ProductModel from "../models/products.model.js";
import { ORDER_STATUS, ORDER_PRIORITY, USER_ROLES } from "../constants/index.js";

const getRandomCustomer = async () => {
    const customers = await UserModel.find({ role: USER_ROLES.CUSTOMER }).select("_id");

    if (!customers.length) {
        throw new Error("No hay usuarios CUSTOMER disponibles para crear un pedido");
    }

    const randomCustomer = faker.helpers.arrayElement(customers);
    return randomCustomer._id;
};

const getRandomStore = async () => {
    const stores = await StoreModel.find().select("_id");

    if (!stores.length) {
        throw new Error("No hay tiendas disponibles para crear un pedido");
    }

    const randomStore = faker.helpers.arrayElement(stores);
    return randomStore._id;
};

const getRandomProducts = async (storeId, quantity = 2) => {
    const products = await ProductModel.find({ store: storeId }).select("_id name price stock");

    if (!products.length) {
        throw new Error("No hay productos disponibles para crear un pedido");
    }

    const selectedProducts = faker.helpers.arrayElements(products, quantity);

    return selectedProducts.map((product) => ({
        productId: product._id,
        name: product.name,
        quantity: faker.number.int({
            min: 1,
            max: Math.min(3, product.stock || 1)
        }),
        price: product.price
    }));
};

export const generateMockOrder = async () => {
    const customer = await getRandomCustomer();
    const store = await getRandomStore();
    const items = await getRandomProducts(store, 2);

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return {
        customer,
        store,
        items,
        deliveryAddress: faker.location.streetAddress({ useFullAddress: true }),
        total,
        status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
        priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
        proof: null
    };
};

export const generateMockOrders = async (quantity = 1) => {
    return Promise.all(
        Array.from({ length: quantity }, () => generateMockOrder())
    );
};