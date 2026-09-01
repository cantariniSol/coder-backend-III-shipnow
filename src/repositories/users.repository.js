import UserModel from "../models/users.model.js";

export const usersRepository = {
    findAll: async ({ page, limit }) => {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            UserModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            UserModel.countDocuments(),
        ]);

        return {
            users,
            total,
        };
    },

    findById: async (id) => {
        return UserModel.findById(id);
    },

    create: async (userData) => {
        return UserModel.create(userData);
    },

    update: async (id, updates) => {
        return UserModel.findByIdAndUpdate(
            id,
            updates,
            { returnDocument: "after", runValidators: true, context: "query" }
        );
    },

    addUploadedDocument: async (id, document) => {
        return UserModel.findByIdAndUpdate(
            id,
            { $push: { uploadedDocuments: document } },
            { returnDocument: "after", runValidators: true, context: "query" }
        );
    },

    delete: async (id) => {
        return UserModel.findByIdAndDelete(id)
    }
};