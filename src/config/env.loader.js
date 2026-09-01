import dotenv from "dotenv";

const environment =
    process.env.NODE_ENV || "development";

const envFile = {
    development: ".env.dev",
    test: ".env.test",
    production: ".env.prod",
}[environment];

dotenv.config({ path: envFile });

if (!process.env.LOG_LEVEL) {
    process.env.LOG_LEVEL = environment === "development" ? "debug" : "info";
}

export default environment;