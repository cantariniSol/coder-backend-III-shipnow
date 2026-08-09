import { faker } from '@faker-js/faker';
import bcrypt from "bcryptjs";
import { USER_ROLES, DOCUMENT_TYPES } from "../constants/index.js";

const documentGenerators = {
    [DOCUMENT_TYPES.DNI]: () => faker.string.numeric(8),

    [DOCUMENT_TYPES.CUIL]: () => faker.string.numeric(11),

    [DOCUMENT_TYPES.CUIT]: () => faker.string.numeric(11),

    [DOCUMENT_TYPES.PASSPORT]: () =>
        faker.string.alphanumeric(9).toUpperCase()
};

const generateDocumentsForRole = (role) => {
    const documentTypesByRole = {
        [USER_ROLES.CUSTOMER]: [
            DOCUMENT_TYPES.DNI,
            DOCUMENT_TYPES.PASSPORT,
            DOCUMENT_TYPES.CUIL,
            DOCUMENT_TYPES.CUIT
        ],

        [USER_ROLES.SELLER]: [
            DOCUMENT_TYPES.CUIT,
            DOCUMENT_TYPES.CUIL,
            DOCUMENT_TYPES.DNI,
            DOCUMENT_TYPES.PASSPORT
        ]
    };

    const documentTypes = documentTypesByRole[role];

    if (!documentTypes) {
        return [];
    }

    const type = faker.helpers.arrayElement(documentTypes);

    return [
        {
            type,
            number: documentGenerators[type]()
        }
    ];
};

const availableRoles = [
    USER_ROLES.CUSTOMER,
    USER_ROLES.SELLER
];

export const generateMockUser = async () => {
    const password = await bcrypt.hash("coder123", 10);

    const role = faker.helpers.arrayElement(availableRoles);

    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: password,
        role: role,
        documents: generateDocumentsForRole(role)
    };
};


export const generateMockUsers = async (quantity = 1) => {
    return Promise.all(
        Array.from({ length: quantity }, () => generateMockUser())
    );
};