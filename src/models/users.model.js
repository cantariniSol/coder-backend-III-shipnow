import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { DOCUMENT_TYPES, USER_ROLES } from "../constants/index.js";

const documentSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        documentType: {
            type: String,
            enum: Object.values(DOCUMENT_TYPES),
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.CUSTOMER
        },
        documents: {
            type: Array,
            default: []
        },
        uploadedDocuments: {
            type: [documentSchema],
            default: []
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// 1. Hook antes de guardar: Encripta la contraseña solo si cambió o es nueva
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 2. Método personalizado: Compara la contraseña enviada con la guardada en BD
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;