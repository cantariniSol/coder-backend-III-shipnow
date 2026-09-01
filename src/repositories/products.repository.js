import ProductModel from "../models/products.model.js";

export const productsRepository = {
    findAll: async ({ page, limit }) => {
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            ProductModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("store")
                .lean(),
            ProductModel.countDocuments(),
        ]);

        return {
            products,
            total,
        };
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
            { returnDocument: 'after', runValidators: true }
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
