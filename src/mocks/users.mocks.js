import { faker } from '@faker-js/faker';
import bcrypt from "bcryptjs";
import { USER_ROLES, DOCUMENT_TYPES } from "../constants/index.js";

const availableRoles = [
    USER_ROLES.CUSTOMER,
    USER_ROLES.SELLER
];

const getRandomRole = () => {
    return faker.helpers.arrayElement(availableRoles);
};

const documentGenerators = {
    [DOCUMENT_TYPES.DNI]: () => faker.string.numeric(8),
    [DOCUMENT_TYPES.CUIL]: () => faker.string.numeric(11),
    [DOCUMENT_TYPES.CUIT]: () => faker.string.numeric(11),
    [DOCUMENT_TYPES.PASSPORT]: () => faker.string.alphanumeric(9).toUpperCase()
};

const generateDocumentsForRole = (role) => {
    const documentTypesByRole = {
        [USER_ROLES.CUSTOMER]: [
            DOCUMENT_TYPES.DNI,
            DOCUMENT_TYPES.CUIL,
            DOCUMENT_TYPES.CUIT,
            DOCUMENT_TYPES.PASSPORT
        ],
        [USER_ROLES.SELLER]: [
            DOCUMENT_TYPES.DNI,
            DOCUMENT_TYPES.CUIL,
            DOCUMENT_TYPES.CUIT,
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

export const generateMockUser = async () => {
    const password = await bcrypt.hash("coder123", 10);
    const role = getRandomRole();

    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password,
        role,
        documents: generateDocumentsForRole(role)
    };
};

export const generateMockUsers = async (quantity = 1) => {
    return Promise.all(
        Array.from({ length: quantity }, () => generateMockUser())
    );
};