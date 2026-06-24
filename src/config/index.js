require("./env.loader");

const validateEnv = require("./env.validate");

validateEnv();

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
};