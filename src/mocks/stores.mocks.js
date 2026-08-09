import { faker } from '@faker-js/faker';
import UserModel from "../models/users.model.js";
import { USER_ROLES } from "../constants/index.js";

const getRandomSeller = async () => {
    const sellers = await UserModel.find({ role: USER_ROLES.SELLER }).select("_id");

    if (!sellers.length) {
        throw new Error("No hay usuarios SELLER disponibles para asignar a una tienda");
    }

    const randomSeller = faker.helpers.arrayElement(sellers);
    return randomSeller._id;
};

export const generateMockStore = async () => {
    const owner = await getRandomSeller();

    return {
        name: faker.company.name(),
        address: faker.location.streetAddress({ useFullAddress: true }),
        owner,
        isActive: faker.datatype.boolean()
    };
};

export const generateMockStores = async (quantity = 1) => {
    return Promise.all(
        Array.from({ length: quantity }, () => generateMockStore())
    );
};