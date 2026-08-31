import { Router } from "express";
import { getUsers, 
        getUserById, 
        createUser, 
        updateUser, 
        deleteUser,
        uploadUserDocument } from "../controllers/users.controller.js";
import { uploadUserDocument as uploadUserDocumentFile } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getUsers);

router.get("/:uid", getUserById);

router.post("/", createUser);

router.post("/:uid/documents", uploadUserDocumentFile, uploadUserDocument);

router.put("/:uid", updateUser);

router.delete("/:uid", deleteUser);

export default router;