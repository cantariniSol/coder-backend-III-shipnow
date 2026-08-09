import dotenv from "dotenv";

const environment =
    process.env.NODE_ENV || "development";

const envFile = {
    development: ".env.dev",
    staging: ".env.stg",
    production: ".env.prod",
}[environment];

dotenv.config({ path: envFile });

export default environment;