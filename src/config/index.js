import "./env.loader.js";
import validateEnv from "./env.validate.js";

validateEnv();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;
const LOG_LEVEL = process.env.LOG_LEVEL;

export default {
    PORT,
    MONGODB_URI,
    NODE_ENV,
    LOG_LEVEL,
};