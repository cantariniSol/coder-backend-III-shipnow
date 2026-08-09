import { faker } from '@faker-js/faker';
import StoreModel from "../models/stores.model.js";
import { PRODUCT_CATEGORIES } from "../constants/index.js";

const availableCategories = Object.values(PRODUCT_CATEGORIES);

const getRandomStore = async () => {
    const stores = await StoreModel.find().select("_id");

    if (!stores.length) {
        throw new Error("No hay tiendas disponibles para asignar a un producto");
    }

    const randomStore = faker.helpers.arrayElement(stores);
    return randomStore._id;
};

export const generateMockProduct = async (code = null) => {
    const store = await getRandomStore();

    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price({ min: 1000, max: 100000, dec: 2 })),
        stock: faker.number.int({ min: 0, max: 50 }),
        category: faker.helpers.arrayElement(availableCategories),
        code: code ?? faker.number.int({ min: 1000, max: 999999 }),
        isActive: faker.datatype.boolean(),
        store
    };
};

export const generateMockProducts = async (quantity = 1, code = null) => {
    return Promise.all(
        Array.from({ length: quantity }, () => generateMockProduct(code))
    );
};