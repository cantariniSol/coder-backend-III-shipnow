import { usersService } from "../services/users.service.js";
import fs from "node:fs/promises";
import logger from "../utils/logger.js";

const removeUploadedFile = async (file) => {
    if (file?.path) {
        await fs.unlink(file.path).catch(() => undefined);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const { users, meta } = await usersService.getUsers(req.query);

        res.json({
            status: "success",
            payload: users,
            meta,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await usersService.getUserById(req.params.uid);
        res.json({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const user = await usersService.createUser(req.body);
        res.status(201).json({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const user = await usersService.updateUser(req.params.uid, req.body);
        res.json({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
};

export const uploadUserDocument = async (req, res, next) => {
    try {
        const user = await usersService.addUploadedDocument(
            req.params.uid,
            req.file,
            req.body.documentType
        );

        const document = user.uploadedDocuments.at(-1);
        logger.info("Documento de usuario cargado", {
            userId: user._id.toString(),
            filename: document.filename,
            documentType: document.documentType,
        });

        res.status(201).json({ status: "success", payload: user });
    } catch (error) {
        await removeUploadedFile(req.file);
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await usersService.deleteUser(req.params.uid);
        res.json({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
};