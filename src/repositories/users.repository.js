import UserModel from "../models/users.model.js";

export const usersRepository = {
    findAll: async () => {
        return UserModel.find();
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

    delete: async (id) => {
        return UserModel.findByIdAndDelete(id)
    }
};