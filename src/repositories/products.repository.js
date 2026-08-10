import ProductModel from "../models/products.model.js";

export const productsRepository = {
    findAll: async () => {
        return ProductModel.find().populate("store");
    },

    findById: async (id) => {
        return ProductModel.findById(id).populate("store");
    },

    create: async (productData) => {
        return ProductModel.create(productData);
    },

    update: async (id, updates) => {
        return ProductModel.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );
    },

    delete: async (id) => {
        return ProductModel.findByIdAndDelete(id);
    },

    findByIdAndPopulate: async (id) => {
        return ProductModel.findById(id).populate("store");
    },

    findByCode: async (code) => {
        return ProductModel.findOne({ code });
    }
};
