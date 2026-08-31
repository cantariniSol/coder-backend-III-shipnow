import multer from "multer";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createError } from "../errors/createError.js";

export const UPLOADS_ROOT = path.resolve("uploads");
export const USER_DOCUMENTS_DIR = path.join(UPLOADS_ROOT, "user-documents");
export const ORDER_PROOFS_DIR = path.join(UPLOADS_ROOT, "order-proofs");
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = new Set([
	"application/pdf",
	"image/jpeg",
	"image/png",
]);

const ensureDirectory = (directory) => {
	fs.mkdirSync(directory, { recursive: true });
	return directory;
};

const createStorage = (directory) => multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, ensureDirectory(directory));
	},
	filename: (req, file, callback) => {
		const extension = path.extname(file.originalname).toLowerCase();
		callback(null, `${Date.now()}-${randomUUID()}${extension}`);
	},
});

const fileFilter = (req, file, callback) => {
	if (!allowedMimeTypes.has(file.mimetype)) {
		return callback(createError("INVALID_FILE_TYPE"));
	}

	callback(null, true);
};

const createUploader = (directory) => multer({
	storage: createStorage(directory),
	fileFilter,
	limits: {
		fileSize: MAX_FILE_SIZE,
	},
});

export const uploadUserDocument = createUploader(USER_DOCUMENTS_DIR).single("document");
export const uploadOrderProof = createUploader(ORDER_PROOFS_DIR).single("proof");
