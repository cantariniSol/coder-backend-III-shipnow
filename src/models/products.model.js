import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        category: {
            type: String,
            enum: ["hogar", "jardin", "oficina", "baño", "cocina", "vestidor", "gareage", "lavadero"],
            default: "customer",
            required: true,
        },
        code: {
            type: Number,
            required: true,
            unique: true,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

//Busca en los campos name, description y category si en un futuro se usa GET /products?search=mesa
//productSchema.index({ name: "text", description: "text", category: "text" });

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
