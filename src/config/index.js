import "./env.loader.js";
import validateEnv from "./env.validate.js";

validateEnv();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;

export default {
    PORT,
    MONGODB_URI,
    NODE_ENV
};